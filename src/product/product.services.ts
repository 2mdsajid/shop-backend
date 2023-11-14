import { Comment, Rating, Review } from '@prisma/client';
import prisma from "../utils/prisma";
import { TypeBaseProduct, TypeDetailedProduct } from "./product.types";

export const listProducts = async (): Promise<TypeBaseProduct[]> => {
    return prisma.product.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
            userId: true
        },
    });
};

export const getProductById = async (productId: string): Promise<TypeDetailedProduct | null> => {
    return prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
            userId: true,
            Comment: true,
            Review: true,
            Rating: true,
        },
    });
};

export const createProduct = async (productData: Omit<TypeBaseProduct, 'id'>): Promise<TypeBaseProduct> => {
    return prisma.product.create({
        data: productData,
    });
};

export const updateProduct = async (productId: string, productData: Partial<Omit<TypeBaseProduct, 'id'>>): Promise<TypeBaseProduct | null> => {
    return prisma.product.update({
        where: {
            id: productId,
        },
        data: productData,
    });
};


export const addCommentToProduct = async (productId: string, commentData: Omit<Comment, 'id'>): Promise<{ content: string }> => {
    return prisma.comment.create({
        data: {
            ...commentData,
            productId,
        },
        select: {
            content: true
        }
    });
};

export const addReviewToProduct = async (productId: string, reviewData: Omit<Review, 'id' | 'productId'>): Promise<{ content: string, title: string }> => {
    return prisma.review.create({
        data: {
            ...reviewData,
            productId,
        },
        select: {
            title: true,
            content: true
        }
    });
};

export const addRatingToProduct = async (productId: string, ratingData: Omit<Rating, 'id' | 'productId'>): Promise<{value:number}> => {
    return prisma.rating.create({
        data: {
            ...ratingData,
            productId,
        },
        select:{
            value:true
        }
    });
};
