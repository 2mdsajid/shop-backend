import { z } from "zod";
// shipping address schema
export const shippingAddressSchema = z.object({
    id: z.string({
        required_error: "ID is required",
    }),
    fullName: z.string({
        required_error: "Full name is required",
    }),
    phoneNumber: z.string({
        required_error: "Phone number is required",
    }),
    address: z.string({
        required_error: "Address is required",
    }),
    city: z.string({
        required_error: "City is required",
    }),
    state: z.string({
        required_error: "State is required",
    }),
    pincode: z.string({
        required_error: "Pincode is required",
    }),
    userId: z.string({
        required_error: "User ID is required",
    }),
});
export const baseShippingAddressSchema = shippingAddressSchema.omit({
    userId: true,
});
export const createShippingAddressSchema = shippingAddressSchema.omit({
    id: true,
    userId: true,
});
