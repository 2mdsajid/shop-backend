import { Comment, Rating, Review } from '@prisma/client';
import prisma from "../utils/prisma";
import { TItemForCheckout, TItemForPlaceOrder, TOrderInfo, TypeBaseProduct, TypeDetailedProduct } from "./product.types";
import jwt from 'jsonwebtoken'

export const getProductById = async (productId: string): Promise<TypeDetailedProduct | null> => {
    return prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
            category: true,
            isFreeDelivery: true,
            itemsLeft: true,
            brand: true,
            images: true,
            userId: true,
            isNew: true,
            hasDiscount: {
                select: {
                    state: true,
                    value: true,
                }
            },
        },
    });
};

export const createProduct = async (productData: TypeBaseProduct) => {
    try {
        const { name, description, price, imageUrl, category, isFreeDelivery, itemsLeft, brand, images, isNew, hasDiscount, userId } = productData
        // Create product
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                imageUrl,
                category,
                isFreeDelivery,
                itemsLeft,
                brand,
                images,
                isNew,
                userId,
            },
        });

        // If hasDiscount is provided, create discount and associate with the product
        if (hasDiscount) {
            await prisma.discount.create({
                data: {
                    state: hasDiscount.state,
                    value: hasDiscount.value,
                    productId: product.id,
                },
            });
        }

        const baseProduct = await prisma.product.findUnique({
            where: { id: product.id },
            select: {
                name: true,
                hasDiscount: true
            }
        })

        return baseProduct


    } catch (error) {
    }
}

export const getLatestProduct = async () => {
    const bags = await prisma.product.findMany({
        where: {
            isNew: true,
        },
        select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            category: true,
            isFreeDelivery: true,
            itemsLeft: true,
            brand: true,
            images: true,
            isNew: true,
            hasDiscount: true,
        },
    })
    return bags;
}

// generate checkout token for checkout pages
export const generateCheckoutToken = (items: TItemForCheckout[]): string => {
    const payload = { items };
    const secret = process.env.CHECKOUT_JWT_TOKEN as string
    const token = jwt.sign(payload, secret, { expiresIn: '20m' });
    return token
}

// decode token for checkout
export const decodeCheckoutToken = (token: string): TItemForCheckout[] => {
    const secret = process.env.CHECKOUT_JWT_TOKEN as string;
    const decoded = jwt.verify(token, secret) as any
    return decoded.items
};
// generate checkout token for checkout pages
export const generatePlaceOrderToken = (items: TItemForPlaceOrder[]): string => {
    const payload = { items };
    const secret = process.env.CHECKOUT_JWT_TOKEN as string
    const token = jwt.sign(payload, secret, { expiresIn: '20m' });
    return token
}

// decode token for checkout
export const decodePlaceOrderToken = (token: string): TItemForPlaceOrder[] => {
    const secret = process.env.CHECKOUT_JWT_TOKEN as string;
    const decoded = jwt.verify(token, secret) as any
    return decoded.items
};

// storign the ordertoken in the respective user database
export const storeOrderTokenToDatabase = async (token: string, userId: string): Promise<TOrderInfo> => {
    const newOrder = await prisma.orders.create({
        data: {
            userId: userId,
            orderToken: token
        },
        select: {
            id: true,
            createdAt: true,
            status: true
        }
    })
    return newOrder
}

