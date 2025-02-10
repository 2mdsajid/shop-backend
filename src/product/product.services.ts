import prisma from "../utils/prisma";
import { TCategory, TProduct, TProductDetail, TProductCreate, TCreateCategory, TProductBase, TUpdateProduct } from './product.schema';

export const getProductCategories = async () => {
    const categories = await prisma.category.findMany({
        select: {
            name: true,
            description: true,
            imageUrl: true
        }
    });
    return categories;
}

export const isCategoryExist = async (name:string):Promise<boolean> => {
    const existingCategory = await prisma.category.findUnique({
        where: {
            name
        }
    });

    if (existingCategory) {
        return true;
    }

    return false;
}

// function to create a category
export const createCategory = async (category: TCreateCategory): Promise<TCategory | null> => {
    const { name, description, imageUrl } = category;

    const newCategory = await prisma.category.create({
        data: {
            name,
            description,
            imageUrl
        }
    });
    return newCategory;
}

// to check if product exist or not
export const isProductExist = async (productId: string): Promise<boolean | null> => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId
        }
    })
    if (!product) {
        return false
    }
    return true
}

export const getProductBaseByCategory = async (category: string): Promise<TProductBase[] | null> => {
    const result = await prisma.category.findFirst({
        where: {
            name: category
        },
        select: {
            products: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    imageUrl: true,
                    category: true,
                    isFreeDelivery: true,
                    brand: true,
                    isNew: true,
                    discount: {
                        select: {
                            value: true,
                            isActive: true,
                        }
                    },
                }
            }
        },
    });

    return result?.products ?? null;
}

export const listAllProducts = async (): Promise<TProductBase[] | null> => {
    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
            category: true,
            isFreeDelivery: true,
            brand: true,
            isNew: true,
            discount: {
                select: {
                    value: true,
                    isActive: true,
                }
            },
        },
    });

    if (!products || products.length === 0) {
        return null
    }

    return products;
};


export const getProductDetailById = async (productId: string): Promise<TProductDetail | null> => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            id: true,
            name: true,
            description: true,
            specifications: true,
            careInstructions: true,
            price: true,
            imageUrl: true,
            category: true,
            isFreeDelivery: true,
            availableStock: true,
            brand: true,
            images: true,
            isNew: true,
            discount: true,
        },
    });

    return product
};

export const getProductBaseById = async (productId: string): Promise<TProductBase | null> => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            category: true,
            isFreeDelivery: true,
            brand: true,
            isNew: true,
            discount: {
                select: {
                    value: true,
                    isActive: true,
                }
            },
        },
    });

    if (!product) {
        return null
    }

    return product;
}


export const createProduct = async (productData: TProductCreate): Promise<TProduct | null> => {
    const {
        name,
        description,
        price,
        imageUrl,
        category,
        isFreeDelivery,
        availableStock,
        specifications,
        careInstructions,
        brand,
        images,
        isNew,
        discount,
    } = productData;

    // Create product
    const newProduct = await prisma.product.create({
        data: {
            name,
            description,
            price,
            imageUrl,
            category,
            isFreeDelivery,
            availableStock,
            brand,
            images,
            isNew,
            specifications,
            careInstructions,
        },
    });

    if (!newProduct) {
        return null
    }

    // If discount is provided, create discount and associate with the product
    if (discount) {
        await prisma.discount.create({
            data: {
                isActive: discount.isActive,
                value: discount.value,
                productId: newProduct.id,
            },
        });
    }

    return newProduct ?? null
}

// update an item from the product
export const updateProduct = async (productId: string, productData: TUpdateProduct): Promise<TProduct | null> => {
    const { name, description, price, imageUrl, category, isFreeDelivery, availableStock, brand, images, isNew, specifications, careInstructions, discount } = productData
    const updatedProduct = await prisma.product.update({
        where: {
            id: productId,
        },
        data: {
            name,
            description,
            price,
            imageUrl,
            category,
            isFreeDelivery,
            availableStock,
            brand,
            images,
            isNew,
            specifications,
            careInstructions,

            // update the discount field if it exists
            discount: {
                update: {
                    isActive: discount?.isActive,
                    value: discount?.value,
                }
            }

        },
    });

    return updatedProduct ?? null;
};

export const getLatestProducts = async (): Promise<TProductBase[] | null> => {
    const bags = await prisma.product.findMany({
        where: {
            isNew: true,
        },
        select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            category: true,
            isFreeDelivery: true,
            brand: true,
            isNew: true,
            discount: {
                select: {
                    value: true,
                    isActive: true,
                }
            },
        },
    })
    if (!bags || bags.length === 0) {
        return null
    }
    return bags;
}


// delete an item from the product
export const deleteProduct = async (id: string): Promise<boolean | null> => {
    const deletedProduct = await prisma.product.delete({
        where: {
            id: id,
        }
    })
    if (!deletedProduct) {
        return false
    }
    return true
}

// check if already in favourite
export const isInFavourite = async (userId: string, productId: string): Promise<boolean> => {
    const favourite = await prisma.favourite.findFirst({
        where: {
            userId: userId,
            productId: productId,
        },
    });
    if (!favourite) {
        return false
    }
    return true
}

// add to favourite
export const addToFavourite = async (userId: string, productId: string): Promise<boolean | null> => {
    const favourite = await prisma.favourite.create({
        data: {
            productId: productId,
            userId: userId,
        },
    });

    if (!favourite) {
        return false
    }

    return true
}

// get favourite products
export const getFavouriteProducts = async (userId: string): Promise<TProductBase[] | null> => {
    const favouriteProducts = await prisma.favourite.findMany({
        where: {
            userId: userId,
        },
        select: {
            product: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    imageUrl: true,
                    category: true,
                    isFreeDelivery: true,
                    brand: true,
                    isNew: true,
                    discount: {
                        select: {
                            value: true,
                            isActive: true,
                        }
                    },
                },
            },
        },
    });

    if (!favouriteProducts || favouriteProducts.length === 0) {
        return null
    }

    return favouriteProducts.map((favourite) => favourite.product);
}


// delete from favourite
export const deleteFavouriteProduct = async (productId: string, userId: string): Promise<boolean> => {
    const favourite = await prisma.favourite.deleteMany({
        where: {
            productId: productId,
            userId: userId,
        },
    });

    if (!favourite) {
        return false
    }

    return true
}
