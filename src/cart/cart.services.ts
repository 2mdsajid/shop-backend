import prisma from "../utils/prisma";
import { CartItem, Rating, Review } from "@prisma/client";
import { TCreateCartItem, TUpdateCartItem } from "./cart.schema";


export const listCartItems = async (): Promise<CartItem[]> => {
    return prisma.cartItem.findMany();
};

export const listCartItemsByUser = async (userId: string): Promise<CartItem[]> => {
    return prisma.cartItem.findMany({
        where: {
            userId: userId,
        },
    });
};

export const createCartItem = async (createCartItemData: TCreateCartItem): Promise<CartItem> => {
    const { userId, productId, quantity } = createCartItemData;
    const existingCartItem = await prisma.cartItem.findUnique({
        where: {
            productId_userId: {
                productId,
                userId,
            },
        },
    });
    if (existingCartItem) {
        return prisma.cartItem.update({
            where: {
                id: existingCartItem.id,
            },
            data: {
                quantity: existingCartItem.quantity + quantity,
            },
        });
    } else {
        return prisma.cartItem.create({
            data: {
                userId,
                productId,
                quantity,
            },
        });
    }
};

export const updateCartItem = async (updateCartItemData: TUpdateCartItem): Promise<CartItem> => {
    const { id, productId, quantity } = updateCartItemData
    const updatedCartItem = await prisma.cartItem.update({
        where: {
            id: id,
        },
        data: {
            quantity: quantity
        }
    });
    return updatedCartItem;
};

export const deleteCartItem = async (cartItemId:number): Promise<CartItem> => {
    const deletedCartItem = await prisma.cartItem.delete({
        where: {
            id: cartItemId,
        },
    });
    return deletedCartItem
};