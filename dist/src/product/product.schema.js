import { z } from 'zod';
// Schema for creating a category
export const categorySchema = z.object({
    name: z.string({ required_error: "Name is required" }),
    description: z.string({ required_error: "Description is required" }),
    imageUrl: z.string({ required_error: "Image URL is required" }).url("Image URL must be a valid URL"),
});
// Base schema for Product
export const productSchema = z.object({
    id: z.string({ required_error: "ID is required" }).uuid("ID must be a valid UUID"),
    name: z.string({ required_error: "Name is required" }),
    description: z.string({ required_error: "Description is required" }),
    specifications: z.string({ required_error: "Specifications are required" }).nullable(),
    careInstructions: z.string({ required_error: "Care instructions are required" }).nullable(),
    price: z.number({ required_error: "Price is required" }).positive("Price must be a positive number"),
    category: z.string({ required_error: "Category is required" }),
    imageUrl: z.string({ required_error: "Image URL is required" }).url("Image URL must be a valid URL"),
    isFreeDelivery: z.boolean({ required_error: "Free delivery status is required" }).default(false),
    availableStock: z.number({ required_error: "Available stock is required" }).int().nonnegative("Available stock must be a non-negative integer"),
    brand: z.string({ required_error: "Brand is required" }).nullable(),
    images: z.array(z.string({ required_error: "Each image URL is required" }).url("Each image URL must be valid")).min(1, { message: "At least one image URL is required" }),
    isNew: z.boolean({ required_error: "New product status is required" }).default(false),
});
// Base schema for Discount
export const discountSchema = z.object({
    id: z.number({ required_error: "ID is required" }).int(),
    isActive: z.boolean({ required_error: "Active status is required" }).default(false),
    value: z.number({ required_error: "Value is required" }).default(0),
    productId: z.string({ required_error: "Product ID is required" }).uuid("Product ID must be a valid UUID"),
});
// Base schema for Discount (includes only active status and value)
export const discountBaseSchema = discountSchema.pick({
    isActive: true,
    value: true,
});
// Base schema for Product (includes only essential fields)
export const productBaseSchema = productSchema.pick({
    id: true,
    name: true,
    imageUrl: true,
    price: true,
    category: true,
    isFreeDelivery: true,
    brand: true,
    isNew: true,
}).extend({
    discount: discountBaseSchema.nullable(),
});
// Schema for Product with Discount
export const productDetailSchema = productSchema.extend({
    discount: discountSchema.nullable(),
});
// schema to create a product
export const createProductSchema = productSchema.omit({
    id: true
}).extend({
    discount: discountBaseSchema.nullable(),
});
// schema to delete a product
export const deleteProductSchema = z.object({
    id: z.string({ required_error: "ID is required" }).uuid("ID must be a valid UUID"),
});
// schema to update a product
export const updateProductSchema = productSchema.omit({
    id: true
}).extend({
    discount: discountBaseSchema.nullable(),
});
