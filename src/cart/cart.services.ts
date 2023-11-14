import prisma from "../utils/prisma";
import { CartItem, Rating, Review } from "@prisma/client";

type CartItemBody = Omit<CartItem, 'id' | 'userId'>

export const listCartItems = async (): Promise<CartItem[]> => {
    return prisma.cartItem.findMany();
};

export const listCartItemsByUser = async (userId: string): Promise<CartItem[]> => {
    return prisma.cartItem.findMany({
        where: {
            userId: userId,
        },
    });
};

export const createCartItem = async (userId: string, data: CartItemBody): Promise<CartItem> => {
    const { productId, quantity } = data;

    const existingCartItem = await prisma.cartItem.findUnique({
        where: {
            productId_userId: {
                productId,
                userId,
            },
        },
    });

    if (existingCartItem) {
        return prisma.cartItem.update({
            where: {
                id: existingCartItem.id,
            },
            data: {
                quantity: existingCartItem.quantity + quantity,
            },
        });
    } else {
        return prisma.cartItem.create({
            data: {
                userId,
                productId,
                quantity,
            },
        });
    }
};

export const updateCartItem = async (userId: string, data: Omit<CartItem, 'userId'>): Promise<CartItem> => {
    return prisma.cartItem.update({
        where: {
            productId_userId: {
                productId:data.productId,
                userId,
            },
        },
        data: {
            quantity: data.quantity
        }
    });
};

export const deleteCartItem = async (userId: string, cartItemId: number): Promise<void> => {
    await prisma.cartItem.delete({
        where: {
            id: cartItemId,
            userId,
        },
    });
};