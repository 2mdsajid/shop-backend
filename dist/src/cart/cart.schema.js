import { z } from 'zod';
// Base Zod schema using Prisma's CartItem type
export const cartItemSchema = z.object({
    id: z.number().int().positive("ID must be a valid positive integer"),
    productId: z.string().nonempty("Product ID must be provided"),
    quantity: z.number().int().positive("Quantity must be a positive integer"),
    userId: z.string().nonempty("User ID must be provided"),
});
export const createCartItemSchema = cartItemSchema.omit({
    id: true,
});
export const updateCartItemSchema = cartItemSchema.omit({
    userId: true,
});
export const deleteCartItemSchema = cartItemSchema.omit({
    productId: true,
    quantity: true,
    userId: true,
});
