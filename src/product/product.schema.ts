import { z } from 'zod';
import type { Product } from '@prisma/client';

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


// Types inferred from the Zod schemas
export type TProduct = z.infer<typeof productSchema>;
export type TDiscount = z.infer<typeof discountSchema>;

export type TProductBase = z.infer<typeof productBaseSchema>;
export type TDiscountBase = z.infer<typeof discountBaseSchema>;

export type TProductDetail = z.infer<typeof productDetailSchema>;

// create product
export type TProductCreate = z.infer<typeof createProductSchema>;

export type TCategory = z.infer<typeof categorySchema>;
export type TCreateCategory = z.infer<typeof categorySchema>;
export type TUpdateProduct = z.infer<typeof updateProductSchema>;


// Check type compatibility with Prisma's Product type
type ProductSchemaCompatibility = TProduct extends Product
  ? "Compatible"
  : "Mismatch";

type Result = ProductSchemaCompatibility;
