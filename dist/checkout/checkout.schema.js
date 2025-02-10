"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutTokenRequestSchema = exports.checkoutItemSchemaWithProductBase = exports.checkoutItemInputSchema = exports.checkoutSchema = exports.checkoutItemSchema = void 0;
const zod_1 = require("zod");
const product_schema_1 = require("../product/product.schema");
// Schema for individual checkout items
exports.checkoutItemSchema = zod_1.z.object({
    id: zod_1.z.string({
        required_error: "ID is required"
    }).uuid(),
    checkoutId: zod_1.z.string({
        required_error: "Checkout ID is required"
    }).uuid(),
    productId: zod_1.z.string({
        required_error: "Product ID is required"
    }).uuid(),
    quantity: zod_1.z.number({
        required_error: "Quantity is required"
    }).int().positive()
});
// Schema for checkout session
exports.checkoutSchema = zod_1.z.object({
    id: zod_1.z.string({
        required_error: "ID is required"
    }).uuid(),
    token: zod_1.z.string({
        required_error: "Token is required"
    }).uuid(),
    createdAt: zod_1.z.date({
        required_error: "Created at is required"
    }),
    expiresAt: zod_1.z.date({
        required_error: "Expires at is required"
    }),
    items: zod_1.z.array(exports.checkoutItemSchema)
});
// Schema for items included in checkout creation
exports.checkoutItemInputSchema = zod_1.z.object({
    productId: zod_1.z.string({
        required_error: "Product ID is required"
    }).uuid(),
    quantity: zod_1.z.number({
        required_error: "Quantity is required"
    }).int().positive()
});
// Schema for items included in checkout creation with product
exports.checkoutItemSchemaWithProductBase = exports.checkoutItemSchema.extend({
    product: product_schema_1.productBaseSchema
});
// Schema for the checkout creation request body
exports.checkoutTokenRequestSchema = zod_1.z.array(exports.checkoutItemInputSchema);
