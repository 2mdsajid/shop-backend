import { z } from "zod";


export const roleSchema = z.enum(['USER', 'ADMIN', 'SAJID']);

// Zod schema for User model
export const userSchema = z.object({
    id: z.string({
        required_error: "ID is required"
    }).uuid("Must be a valid UUID"),
    googleId: z.string().nullable(),
    name: z.string({
        required_error: "Name is required"  
    }),
    email: z.string({
        required_error: "Email is required"
    }).email("Must be a valid email address"),
    image: z.string().nullable(),
    password: z.string({
        required_error: "Password is required"
    }).default(""),
    role: roleSchema.default('USER'),
    key: z.string().nullable(),
    createdAt: z.date().default(new Date()),
    emailVerified: z.date().nullable(),
    ipAddress: z.string().nullable(),
});

export const baseUserSchema = z.object({
    email: z.string({
        required_error: "Email is required"
    }).email("Must be a valid email address"),
    name: z.string({
        required_error: "Name is required"
    }),
    id: z.string({
        required_error: "ID is required"
    }),
    googleId: z.string().nullable(),
    role: roleSchema,
});


export const createUserSchema = z.object({
    name: z.string({
        required_error: "Name is required",
    }),
    email: z.string({
        required_error: "Email is required",
    }),
    password: z.string({
        required_error: "Password is required",
    }),
});


export const loginUserSchema = z.object({
    email: z.string({
        required_error: "Email is required",
    }),
    password: z.string({
        required_error: "Password is required",
    }),
});


export const loginWithLuciaGoogleSchema = z.object({
    googleId: z.string({
        required_error: "Google ID is required",
    }),
    image: z.string().nullable(),
    email: z.string({
        required_error: "Email is required", 
    }).email("A valid email is required"),
    name: z.string({
        required_error: "Name is required",
    }),
});




export const generateAuthTokenSchema = z.object({
    name: z.string({
        required_error: "Name must be provided",
    }),
    email: z.string({
        required_error: "Email must be provided",
    }).email("Email must be a valid email"),
    id: z.string({
        required_error: "ID must be provided", 
    }),
    role: roleSchema,
    googleId: z.string().nullable(),
});





// Type inference for User

export type TRole = z.infer<typeof roleSchema>;
export type TUser = z.infer<typeof userSchema>;
export type TBaseUser = z.infer<typeof baseUserSchema>;
export type TCreateUser = z.infer<typeof createUserSchema>;
export type TLoginUser = z.infer<typeof loginUserSchema>;
export type TLoginWithLuciaGoogle = z.infer<typeof loginWithLuciaGoogleSchema>;
export type TGenerateAuthToken = z.infer<typeof generateAuthTokenSchema>;

