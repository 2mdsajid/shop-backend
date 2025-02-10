"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.deleteProductSchema = exports.createProductSchema = exports.productDetailSchema = exports.productBaseSchema = exports.discountBaseSchema = exports.discountSchema = exports.productSchema = exports.categorySchema = void 0;
const zod_1 = require("zod");
// Schema for creating a category
exports.categorySchema = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }),
    description: zod_1.z.string({ required_error: "Description is required" }),
    imageUrl: zod_1.z.string({ required_error: "Image URL is required" }).url("Image URL must be a valid URL"),
});
// Base schema for Product
exports.productSchema = zod_1.z.object({
    id: zod_1.z.string({ required_error: "ID is required" }).uuid("ID must be a valid UUID"),
    name: zod_1.z.string({ required_error: "Name is required" }),
    description: zod_1.z.string({ required_error: "Description is required" }),
    specifications: zod_1.z.string({ required_error: "Specifications are required" }).nullable(),
    careInstructions: zod_1.z.string({ required_error: "Care instructions are required" }).nullable(),
    price: zod_1.z.number({ required_error: "Price is required" }).positive("Price must be a positive number"),
    category: zod_1.z.string({ required_error: "Category is required" }),
    imageUrl: zod_1.z.string({ required_error: "Image URL is required" }).url("Image URL must be a valid URL"),
    isFreeDelivery: zod_1.z.boolean({ required_error: "Free delivery status is required" }).default(false),
    availableStock: zod_1.z.number({ required_error: "Available stock is required" }).int().nonnegative("Available stock must be a non-negative integer"),
    brand: zod_1.z.string({ required_error: "Brand is required" }).nullable(),
    images: zod_1.z.array(zod_1.z.string({ required_error: "Each image URL is required" }).url("Each image URL must be valid")).min(1, { message: "At least one image URL is required" }),
    isNew: zod_1.z.boolean({ required_error: "New product status is required" }).default(false),
});
// Base schema for Discount
exports.discountSchema = zod_1.z.object({
    id: zod_1.z.number({ required_error: "ID is required" }).int(),
    isActive: zod_1.z.boolean({ required_error: "Active status is required" }).default(false),
    value: zod_1.z.number({ required_error: "Value is required" }).default(0),
    productId: zod_1.z.string({ required_error: "Product ID is required" }).uuid("Product ID must be a valid UUID"),
});
// Base schema for Discount (includes only active status and value)
exports.discountBaseSchema = exports.discountSchema.pick({
    isActive: true,
    value: true,
});
// Base schema for Product (includes only essential fields)
exports.productBaseSchema = exports.productSchema.pick({
    id: true,
    name: true,
    imageUrl: true,
    price: true,
    category: true,
    isFreeDelivery: true,
    brand: true,
    isNew: true,
}).extend({
    discount: exports.discountBaseSchema.nullable(),
});
// Schema for Product with Discount
exports.productDetailSchema = exports.productSchema.extend({
    discount: exports.discountSchema.nullable(),
});
// schema to create a product
exports.createProductSchema = exports.productSchema.omit({
    id: true
}).extend({
    discount: exports.discountBaseSchema.nullable(),
});
// schema to delete a product
exports.deleteProductSchema = zod_1.z.object({
    id: zod_1.z.string({ required_error: "ID is required" }).uuid("ID must be a valid UUID"),
});
// schema to update a product
exports.updateProductSchema = exports.productSchema.omit({
    id: true
}).extend({
    discount: exports.discountBaseSchema.nullable(),
});
