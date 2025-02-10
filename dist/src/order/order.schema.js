import { z } from "zod";
import { baseShippingAddressSchema } from "../shipping/shipping.schema";
// Order status enum
export const orderStatusSchema = z.enum(["CREATED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]);
// Order Item Schema
export const orderItemSchema = z.object({
    id: z.string().uuid("Order Item ID must be a valid UUID"),
    productId: z.string().uuid("Product ID must be a valid UUID"),
    price: z.number().positive("Price must be a positive number"),
    quantity: z.number()
        .int()
        .min(1, "Quantity must be at least 1")
        .refine((val) => Number.isInteger(val), { message: "Quantity must be an integer" }),
    orderId: z.string().uuid("Order ID must be a valid UUID"),
}).strict();
// Order Schema
export const orderSchema = z.object({
    id: z.string().uuid("Order ID must be a valid UUID"),
    orderToken: z.string().min(1, "Order token cannot be empty"),
    createdAt: z.date().default(() => new Date()), // Fixed default value
    status: orderStatusSchema.default("CREATED"),
    createdById: z.string(),
    shippingAddressId: z.string(),
}).strict();
// Order Base Schema (Minimal Info)
export const orderBaseSchema = orderSchema.pick({
    id: true,
    createdAt: true,
    status: true,
}).extend({
    orderedBy: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
    })
}).strict();
// Order Item Base Schema (For listing order items)
export const orderItemBaseSchema = orderItemSchema.pick({
    price: true,
    quantity: true,
}).extend({
    product: z.object({
        id: z.string(),
        name: z.string(),
        imageUrl: z.string(),
        category: z.string(),
    })
}).strict();
// Detailed Order Schema (Includes order items and shipping details)
export const orderDetailSchema = orderSchema.pick({
    id: true,
    orderToken: true,
    createdAt: true,
    status: true,
}).extend({
    orderItems: z.array(orderItemBaseSchema).optional(),
    shippingAddress: baseShippingAddressSchema.optional(),
    orderedBy: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
    })
}).strict();
// Schema for Creating an Order
export const createOrderItemSchema = z.object({
    productId: z.string().uuid("Product ID must be a valid UUID"),
    price: z.number().min(0, "Price must be greater than or equal to 0"),
    quantity: z.number()
        .int()
        .min(1, "Quantity must be at least 1")
        .refine((val) => Number.isInteger(val), { message: "Quantity must be an integer" }),
}).strict();
export const createOrderSchema = z.object({
    shippingAddressId: z.string(),
    items: z.array(createOrderItemSchema),
}).strict();
export const updateOrderStatusSchema = z.object({
    status: orderStatusSchema,
}).strict();
