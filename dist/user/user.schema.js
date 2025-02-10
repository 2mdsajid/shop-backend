"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAuthTokenSchema = exports.loginWithLuciaGoogleSchema = exports.loginUserSchema = exports.createUserSchema = exports.baseUserSchema = exports.userSchema = exports.roleSchema = void 0;
const zod_1 = require("zod");
exports.roleSchema = zod_1.z.enum(['USER', 'ADMIN', 'SAJID']);
// Zod schema for User model
exports.userSchema = zod_1.z.object({
    id: zod_1.z.string({
        required_error: "ID is required"
    }).uuid("Must be a valid UUID"),
    googleId: zod_1.z.string().nullable(),
    name: zod_1.z.string({
        required_error: "Name is required"
    }),
    email: zod_1.z.string({
        required_error: "Email is required"
    }).email("Must be a valid email address"),
    image: zod_1.z.string().nullable(),
    password: zod_1.z.string({
        required_error: "Password is required"
    }).default(""),
    role: exports.roleSchema.default('USER'),
    key: zod_1.z.string().nullable(),
    createdAt: zod_1.z.date().default(new Date()),
    emailVerified: zod_1.z.date().nullable(),
    ipAddress: zod_1.z.string().nullable(),
});
exports.baseUserSchema = zod_1.z.object({
    email: zod_1.z.string({
        required_error: "Email is required"
    }).email("Must be a valid email address"),
    name: zod_1.z.string({
        required_error: "Name is required"
    }),
    id: zod_1.z.string({
        required_error: "ID is required"
    }),
    googleId: zod_1.z.string().nullable(),
    role: exports.roleSchema,
});
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "Name is required",
    }),
    email: zod_1.z.string({
        required_error: "Email is required",
    }),
    password: zod_1.z.string({
        required_error: "Password is required",
    }),
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string({
        required_error: "Email is required",
    }),
    password: zod_1.z.string({
        required_error: "Password is required",
    }),
});
exports.loginWithLuciaGoogleSchema = zod_1.z.object({
    googleId: zod_1.z.string({
        required_error: "Google ID is required",
    }),
    image: zod_1.z.string().nullable(),
    email: zod_1.z.string({
        required_error: "Email is required",
    }).email("A valid email is required"),
    name: zod_1.z.string({
        required_error: "Name is required",
    }),
});
exports.generateAuthTokenSchema = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "Name must be provided",
    }),
    email: zod_1.z.string({
        required_error: "Email must be provided",
    }).email("Email must be a valid email"),
    id: zod_1.z.string({
        required_error: "ID must be provided",
    }),
    role: exports.roleSchema,
    googleId: zod_1.z.string().nullable(),
});
