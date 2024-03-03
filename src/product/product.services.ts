import { Comment, Order, OrderItem, Rating, Review } from '@prisma/client';
import prisma from "../utils/prisma";
import { TItemForCheckout, TItemForPlaceOrder, TOrderInfoExtended, TOrderInfo, TypeBaseProduct, TypeDetailedProduct, TOrderStatsTable, TOrderProductBasic, TOrderStatus } from "./product.types";
import jwt from 'jsonwebtoken'

export const getProductCategories = async (): Promise<string[] | null> => {
    const categories = await prisma.product.findMany({
        distinct: ['category'],
    });
    return categories.map((product) => product.category);
}

export const getProductsByCategory = async (category: string): Promise<TypeBaseProduct[] | null> => {
    const products = await prisma.product.findMany({
        where: {
            category: category,
        },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
            category: true,
            userId: true,
            isFreeDelivery: true,
            itemsLeft: true,
            brand: true,
            images: true,
            isNew: true,
            hasDiscount: true,
        },
    });

    return products;
}

export const listProducts = async (): Promise<TypeBaseProduct[]> => {
    return prisma.product.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
            category: true,
            userId: true,
            isFreeDelivery: true,
            itemsLeft: true,
            brand: true,
            images: true,
            isNew: true,
            hasDiscount: true,
        },
    });
};


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

// update an item from the product
export const updateProduct = async (productId: string, productData: TypeBaseProduct): Promise<void> => {
    const { name, description, price, imageUrl, category, isFreeDelivery, itemsLeft, brand, images, isNew, hasDiscount, userId } = productData
    const updatedProduct = await prisma.product.update({
        where: {
            id: productId,
        },
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
        },
    });

    // If hasDiscount is provided, create discount - if not found else associate with the product
    if (hasDiscount) {
        await prisma.discount.upsert({
            where: {
                productId: productId,
            },
            update: {
                state: hasDiscount.state,
                value: hasDiscount.value,
            },
            create: {
                state: hasDiscount.state,
                value: hasDiscount.value,
                productId: updatedProduct.id,
            },
        });
    }
    
};

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

// aving the items in an order
//  to retrive them by this method .. not by jwt token
export const storeOrderItems = async (items: TItemForPlaceOrder[], orderId: string): Promise<void> => {
    const orderItemsData = items.map((item) => ({
        productId: item.id,
        price: item.price,
        quantity: item.quantity,
        orderId: orderId,
    }));

    await prisma.orderItem.createMany({
        data: orderItemsData,
    });
}

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

// delete an item from the product
export const deleteProduct = async (id: string): Promise<void> => {
    await prisma.product.delete({
        where: {
            id: id,
        }
    })
}

// get all orders for dashboard -- admin
export const getAllOrders = async (): Promise<TOrderStatsTable[] | null> => {
    const allOrders = await prisma.order.findMany({
        select: {
            id: true,
            createdAt: true,
            status: true,
            User: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    })

    if (!allOrders || allOrders.length === 0) {
        return null;
    }

    const ordersStatsTable: TOrderStatsTable[] = allOrders.map((order) => {
        return {
            id: order.id,
            createdAt: order.createdAt.toISOString(),
            status: order.status,
            userName: order.User.name,
            userEmail: order.User.email,
        };
    })

    return ordersStatsTable
}

// get a singl order  -- admin mb
export const getOrderById = async (id: string): Promise<{
    products: TOrderProductBasic[],
    orderInfo: TOrderInfo
}> => {
    const order = await prisma.order.findUnique({
        where: {
            id: id,
        },
        include: {
            orderItems: {
                select: {
                    price: true,
                    quantity: true,
                    Product: {
                        select: {
                            name: true,
                            imageUrl: true,
                            category: true,
                        }
                    }
                }
            }
        }
    })

    if (!order) throw new Error()

    const products = order?.orderItems.map(item => ({
        name: item.Product.name,
        imageUrl: item.Product.imageUrl,
        category: item.Product.category,
        price: item.price,
        quantity: item.quantity,
    })) || []

    const orderInfo = {
        id: order.id,
        createdAt: order.createdAt,
        status: order.status,
    }

    return { products, orderInfo }
}

// to update the order status of specific order
export const updateOrderStatus = async (status: TOrderStatus, orderId: string): Promise<void> => {
    await prisma.order.update({
        where: {
            id: orderId,
        },
        data: {
            status: status
        }
    })
}

