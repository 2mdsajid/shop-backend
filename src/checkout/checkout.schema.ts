import { z } from "zod";
import { productBaseSchema } from "../product/product.schema";
// Schema for individual checkout items
export const checkoutItemSchema = z.object({
    id: z.string({
        required_error: "ID is required"
    }).uuid(),
    checkoutId: z.string({
        required_error: "Checkout ID is required"
    }).uuid(),
    productId: z.string({
        required_error: "Product ID is required"
    }).uuid(),
    quantity: z.number({
        required_error: "Quantity is required"
    }).int().positive()
});


// Schema for checkout session
export const checkoutSchema = z.object({
    id: z.string({
        required_error: "ID is required"
    }).uuid(),
    token: z.string({
        required_error: "Token is required"
    }).uuid(),
    createdAt: z.date({
        required_error: "Created at is required"
    }),
    expiresAt: z.date({
        required_error: "Expires at is required"
    }),
    items: z.array(checkoutItemSchema)
});

// Schema for items included in checkout creation
export const checkoutItemInputSchema = z.object({
    productId: z.string({
        required_error: "Product ID is required"
    }).uuid(),
    quantity: z.number({
        required_error: "Quantity is required"
    }).int().positive()
});


// Schema for items included in checkout creation with product
export const checkoutItemSchemaWithProductBase = checkoutItemSchema.extend({
    product: productBaseSchema
});


// Schema for the checkout creation request body
export const checkoutTokenRequestSchema = z.array(checkoutItemInputSchema);

// Inferred TypeScript types from schemas
export type TCheckout = z.infer<typeof checkoutSchema>;

export type TCheckoutItem = z.infer<typeof checkoutItemSchema>;
export type TCheckoutItemWithProductBase = z.infer<typeof checkoutItemSchemaWithProductBase>;

export type TCheckoutItemInput = z.infer<typeof checkoutItemInputSchema>;