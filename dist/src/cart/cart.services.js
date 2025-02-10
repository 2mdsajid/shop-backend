import prisma from "../utils/prisma";
export const listCartItems = async () => {
    return prisma.cartItem.findMany();
};
export const listCartItemsByUser = async (userId) => {
    return prisma.cartItem.findMany({
        where: {
            userId: userId,
        },
    });
};
export const createCartItem = async (createCartItemData) => {
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
    }
    else {
        return prisma.cartItem.create({
            data: {
                userId,
                productId,
                quantity,
            },
        });
    }
};
export const updateCartItem = async (updateCartItemData) => {
    const { id, productId, quantity } = updateCartItemData;
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
export const deleteCartItem = async (cartItemId) => {
    const deletedCartItem = await prisma.cartItem.delete({
        where: {
            id: cartItemId,
        },
    });
    return deletedCartItem;
};
