"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCartItemSchema = exports.updateCartItemSchema = exports.createCartItemSchema = exports.cartItemSchema = void 0;
const zod_1 = require("zod");
// Base Zod schema using Prisma's CartItem type
exports.cartItemSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive("ID must be a valid positive integer"),
    productId: zod_1.z.string().nonempty("Product ID must be provided"),
    quantity: zod_1.z.number().int().positive("Quantity must be a positive integer"),
    userId: zod_1.z.string().nonempty("User ID must be provided"),
});
exports.createCartItemSchema = exports.cartItemSchema.omit({
    id: true,
});
exports.updateCartItemSchema = exports.cartItemSchema.omit({
    userId: true,
});
exports.deleteCartItemSchema = exports.cartItemSchema.omit({
    productId: true,
    quantity: true,
    userId: true,
});
