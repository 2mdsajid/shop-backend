import { isUUID } from "../utils/functions";
import prisma from "../utils/prisma";
import { generateAuthToken } from './user.methods';
import { TBaseUser, TCreateUser, TLoginUser, TLoginWithLuciaGoogle, TUser } from "./user.schema";


export const checkEmailExist = async (email: string): Promise<boolean> => {
    const isUserWithEmailExist = await prisma.user.findFirst({
        where: { email }
    })
    if (isUserWithEmailExist) return true;
    return false;
}


export const isUserExist = async (id: string): Promise<boolean> => {
    const isIdUuid = isUUID(id)
    if (!isIdUuid) return false

    const user = await prisma.user.findUnique({
        where: { id }
    })

    if (!user) return false;
    return true;
}


export const userSignUp = async (userData: TCreateUser): Promise<TUser> => {
    const { name, email, password } = userData
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password,
        }
    })
    return newUser
}


export const loginUser = async (userData: TLoginUser): Promise<string | null> => {
    try {
        const { password, email } = userData
        const existingUser = await prisma.user.findFirst({
            where: {
                email, password
            }
        })
        if (!existingUser) return null
        const token = await generateAuthToken(existingUser)
        return token
    } catch (error) {
        return null
    }
}

export const loginWithLuciaGoogleUser = async (userData: TLoginWithLuciaGoogle): Promise<TBaseUser | null> => {
    try {
        const { email, googleId } = userData
        const existingUser = await prisma.user.findFirst({
            where: {
                email,
                googleId
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                googleId: true
            }
        })
        if (!existingUser) return null
        return existingUser
    } catch (error) {
        return null
    }
}


export const signupWithLuciaGoogleUser = async (userData: TLoginWithLuciaGoogle): Promise<TBaseUser | null> => {
    try {
        const { email, googleId, name, image } = userData
        const existingUser = await prisma.user.create({
            data: {
                email,
                googleId,
                name,
                image
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                googleId: true
            }
        })
        if (!existingUser) return null
        return existingUser
    } catch (error) {
        console.log("🚀 ~ signupWithLuciaGoogleUser ~ error:", error)
        return null
    }
}

export const changeRole = async (userData: TLoginUser): Promise<string | null> => {
    try {
        const { password, email } = userData
        const existingUser = await prisma.user.findFirst({
            where: {
                email, password
            }
        })
        if (!existingUser) return null

        const changesUser = await prisma.user.update({
            where: {
                id: existingUser.id
            },
            data: {
                role: "SAJID",
            }
        })

        if (!changesUser) return null
        return changesUser.id
    } catch (error) {
        return null
    }
}


export const getUserById = async (userId: string): Promise<TBaseUser | null> => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            email: true,
            googleId: true,
            role: true,
        }
    })
    if (!user) return null
    return user
}

