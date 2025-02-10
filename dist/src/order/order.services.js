import prisma from '../utils/prisma';
import { generateSecureToken } from '../checkout/checkout.methods';
// generate order token for checkout pages
export const createOrder = async (orderData, createdById) => {
    const { shippingAddressId, items } = orderData;
    const newOrder = await prisma.order.create({
        data: {
            shippingAddressId: shippingAddressId,
            orderedById: createdById,
            orderToken: generateSecureToken(16),
        }
    });
    if (!newOrder || !newOrder.id) {
        return null;
    }
    const orderItemsData = items.map((item) => ({
        productId: item.productId,
        price: item.price,
        quantity: item.quantity,
        orderId: newOrder.id,
    }));
    const orderItems = await prisma.orderItem.createMany({
        data: orderItemsData,
    });
    if (!orderItems) {
        return null;
    }
    console.log(newOrder.orderToken);
    return newOrder.orderToken;
};
// decode token for checkout
export const verifyOrderTokenAndGetOrderId = async (token) => {
    const order = await prisma.order.findUnique({
        where: {
            orderToken: token,
        },
    });
    if (!order)
        throw new Error();
    return order.id;
};
// storing the items in an order --- not used btw
export const storeOrderItems = async (items, orderId) => {
    const orderItemsData = items.map((item) => ({
        productId: item.productId,
        price: item.price,
        quantity: item.quantity,
        orderId: orderId,
    }));
    await prisma.orderItem.createMany({
        data: orderItemsData,
    });
};
// get all orders for dashboard -- admin
export const getAllOrders = async () => {
    const orders = await prisma.order.findMany({
        select: {
            id: true,
            createdAt: true,
            status: true,
            orderedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            }
        }
    });
    if (!orders || orders.length === 0) {
        return null;
    }
    const ordersStatsTable = orders.map((order) => {
        return {
            id: order.id,
            createdAt: order.createdAt,
            status: order.status,
            orderedBy: {
                id: order.orderedBy.id,
                name: order.orderedBy.name,
                email: order.orderedBy.email,
            }
        };
    });
    return ordersStatsTable;
};
// get a singl order  -- admin mb
export const getOrderById = async (id) => {
    const order = await prisma.order.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            orderToken: true,
            createdAt: true,
            status: true,
            orderItems: {
                select: {
                    price: true,
                    quantity: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            imageUrl: true,
                            category: true,
                        }
                    }
                }
            },
            shippingAddress: {
                select: {
                    id: true,
                    fullName: true,
                    phoneNumber: true,
                    address: true,
                    city: true,
                    state: true,
                    pincode: true,
                }
            },
            orderedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
        }
    });
    if (!order)
        throw new Error();
    return order;
};
// to update the order status of specific order
export const updateOrderStatus = async (status, orderId) => {
    const updatedOrderStatus = await prisma.order.update({
        where: {
            id: orderId,
        },
        data: {
            status: status
        },
        select: {
            id: true,
            createdAt: true,
            status: true,
            orderedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            }
        }
    });
    if (!updatedOrderStatus) {
        return null;
    }
    return updatedOrderStatus;
};
// get orders by a user
export const getOrdersByUserId = async (userId) => {
    const orders = await prisma.order.findMany({
        where: {
            orderedById: userId,
        },
        select: {
            id: true,
            createdAt: true,
            status: true,
            orderedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            }
        }
    });
    if (!orders || orders.length === 0) {
        return null;
    }
    return orders;
};
