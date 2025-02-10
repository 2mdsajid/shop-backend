"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusSchema = exports.createOrderSchema = exports.createOrderItemSchema = exports.orderDetailSchema = exports.orderItemBaseSchema = exports.orderBaseSchema = exports.orderSchema = exports.orderItemSchema = exports.orderStatusSchema = void 0;
const zod_1 = require("zod");
const shipping_schema_1 = require("../shipping/shipping.schema");
// Order status enum
exports.orderStatusSchema = zod_1.z.enum(["CREATED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]);
// Order Item Schema
exports.orderItemSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Order Item ID must be a valid UUID"),
    productId: zod_1.z.string().uuid("Product ID must be a valid UUID"),
    price: zod_1.z.number().positive("Price must be a positive number"),
    quantity: zod_1.z.number()
        .int()
        .min(1, "Quantity must be at least 1")
        .refine((val) => Number.isInteger(val), { message: "Quantity must be an integer" }),
    orderId: zod_1.z.string().uuid("Order ID must be a valid UUID"),
}).strict();
// Order Schema
exports.orderSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Order ID must be a valid UUID"),
    orderToken: zod_1.z.string().min(1, "Order token cannot be empty"),
    createdAt: zod_1.z.date().default(() => new Date()), // Fixed default value
    status: exports.orderStatusSchema.default("CREATED"),
    createdById: zod_1.z.string(),
    shippingAddressId: zod_1.z.string(),
}).strict();
// Order Base Schema (Minimal Info)
exports.orderBaseSchema = exports.orderSchema.pick({
    id: true,
    createdAt: true,
    status: true,
}).extend({
    orderedBy: zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        email: zod_1.z.string(),
    })
}).strict();
// Order Item Base Schema (For listing order items)
exports.orderItemBaseSchema = exports.orderItemSchema.pick({
    price: true,
    quantity: true,
}).extend({
    product: zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        imageUrl: zod_1.z.string(),
        category: zod_1.z.string(),
    })
}).strict();
// Detailed Order Schema (Includes order items and shipping details)
exports.orderDetailSchema = exports.orderSchema.pick({
    id: true,
    orderToken: true,
    createdAt: true,
    status: true,
}).extend({
    orderItems: zod_1.z.array(exports.orderItemBaseSchema).optional(),
    shippingAddress: shipping_schema_1.baseShippingAddressSchema.optional(),
    orderedBy: zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        email: zod_1.z.string(),
    })
}).strict();
// Schema for Creating an Order
exports.createOrderItemSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid("Product ID must be a valid UUID"),
    price: zod_1.z.number().min(0, "Price must be greater than or equal to 0"),
    quantity: zod_1.z.number()
        .int()
        .min(1, "Quantity must be at least 1")
        .refine((val) => Number.isInteger(val), { message: "Quantity must be an integer" }),
}).strict();
exports.createOrderSchema = zod_1.z.object({
    shippingAddressId: zod_1.z.string(),
    items: zod_1.z.array(exports.createOrderItemSchema),
}).strict();
exports.updateOrderStatusSchema = zod_1.z.object({
    status: exports.orderStatusSchema,
}).strict();
