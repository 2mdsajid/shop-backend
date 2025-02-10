"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShippingAddressSchema = exports.baseShippingAddressSchema = exports.shippingAddressSchema = void 0;
const zod_1 = require("zod");
// shipping address schema
exports.shippingAddressSchema = zod_1.z.object({
    id: zod_1.z.string({
        required_error: "ID is required",
    }),
    fullName: zod_1.z.string({
        required_error: "Full name is required",
    }),
    phoneNumber: zod_1.z.string({
        required_error: "Phone number is required",
    }),
    address: zod_1.z.string({
        required_error: "Address is required",
    }),
    city: zod_1.z.string({
        required_error: "City is required",
    }),
    state: zod_1.z.string({
        required_error: "State is required",
    }),
    pincode: zod_1.z.string({
        required_error: "Pincode is required",
    }),
    userId: zod_1.z.string({
        required_error: "User ID is required",
    }),
});
exports.baseShippingAddressSchema = exports.shippingAddressSchema.omit({
    userId: true,
});
exports.createShippingAddressSchema = exports.shippingAddressSchema.omit({
    id: true,
    userId: true,
});
