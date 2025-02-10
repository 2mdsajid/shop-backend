"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersByUserId = exports.updateOrderStatus = exports.getOrderById = exports.getAllOrders = exports.storeOrderItems = exports.verifyOrderTokenAndGetOrderId = exports.createOrder = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const checkout_methods_1 = require("../checkout/checkout.methods");
// generate order token for checkout pages
const createOrder = (orderData, createdById) => __awaiter(void 0, void 0, void 0, function* () {
    const { shippingAddressId, items } = orderData;
    const newOrder = yield prisma_1.default.order.create({
        data: {
            shippingAddressId: shippingAddressId,
            orderedById: createdById,
            orderToken: (0, checkout_methods_1.generateSecureToken)(16),
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
    const orderItems = yield prisma_1.default.orderItem.createMany({
        data: orderItemsData,
    });
    if (!orderItems) {
        return null;
    }
    console.log(newOrder.orderToken);
    return newOrder.orderToken;
});
exports.createOrder = createOrder;
// decode token for checkout
const verifyOrderTokenAndGetOrderId = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield prisma_1.default.order.findUnique({
        where: {
            orderToken: token,
        },
    });
    if (!order)
        throw new Error();
    return order.id;
});
exports.verifyOrderTokenAndGetOrderId = verifyOrderTokenAndGetOrderId;
// storing the items in an order --- not used btw
const storeOrderItems = (items, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const orderItemsData = items.map((item) => ({
        productId: item.productId,
        price: item.price,
        quantity: item.quantity,
        orderId: orderId,
    }));
    yield prisma_1.default.orderItem.createMany({
        data: orderItemsData,
    });
});
exports.storeOrderItems = storeOrderItems;
// get all orders for dashboard -- admin
const getAllOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma_1.default.order.findMany({
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
});
exports.getAllOrders = getAllOrders;
// get a singl order  -- admin mb
const getOrderById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield prisma_1.default.order.findUnique({
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
});
exports.getOrderById = getOrderById;
// to update the order status of specific order
const updateOrderStatus = (status, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedOrderStatus = yield prisma_1.default.order.update({
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
});
exports.updateOrderStatus = updateOrderStatus;
// get orders by a user
const getOrdersByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma_1.default.order.findMany({
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
});
exports.getOrdersByUserId = getOrdersByUserId;
