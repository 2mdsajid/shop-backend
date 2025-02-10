"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFavouriteProduct = exports.getFavouriteProducts = exports.addToFavourite = exports.isInFavourite = exports.deleteProduct = exports.getLatestProducts = exports.updateProduct = exports.createProduct = exports.getProductBaseById = exports.getProductDetailById = exports.listAllProducts = exports.getProductBaseByCategory = exports.isProductExist = exports.createCategory = exports.isCategoryExist = exports.getProductCategories = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getProductCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma_1.default.category.findMany({
        select: {
            name: true,
            description: true,
            imageUrl: true
        }
    });
    return categories;
});
exports.getProductCategories = getProductCategories;
const isCategoryExist = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCategory = yield prisma_1.default.category.findUnique({
        where: {
            name
        }
    });
    if (existingCategory) {
        return true;
    }
    return false;
});
exports.isCategoryExist = isCategoryExist;
// function to create a category
const createCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, imageUrl } = category;
    const newCategory = yield prisma_1.default.category.create({
        data: {
            name,
            description,
            imageUrl
        }
    });
    return newCategory;
});
exports.createCategory = createCategory;
// to check if product exist or not
const isProductExist = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUnique({
        where: {
            id: productId
        }
    });
    if (!product) {
        return false;
    }
    return true;
});
exports.isProductExist = isProductExist;
const getProductBaseByCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield prisma_1.default.category.findFirst({
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
    return (_a = result === null || result === void 0 ? void 0 : result.products) !== null && _a !== void 0 ? _a : null;
});
exports.getProductBaseByCategory = getProductBaseByCategory;
const listAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma_1.default.product.findMany({
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
        return null;
    }
    return products;
});
exports.listAllProducts = listAllProducts;
const getProductDetailById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUnique({
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
    return product;
});
exports.getProductDetailById = getProductDetailById;
const getProductBaseById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUnique({
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
        return null;
    }
    return product;
});
exports.getProductBaseById = getProductBaseById;
const createProduct = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, imageUrl, category, isFreeDelivery, availableStock, specifications, careInstructions, brand, images, isNew, discount, } = productData;
    // Create product
    const newProduct = yield prisma_1.default.product.create({
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
        return null;
    }
    // If discount is provided, create discount and associate with the product
    if (discount) {
        yield prisma_1.default.discount.create({
            data: {
                isActive: discount.isActive,
                value: discount.value,
                productId: newProduct.id,
            },
        });
    }
    return newProduct !== null && newProduct !== void 0 ? newProduct : null;
});
exports.createProduct = createProduct;
// update an item from the product
const updateProduct = (productId, productData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, imageUrl, category, isFreeDelivery, availableStock, brand, images, isNew, specifications, careInstructions, discount } = productData;
    const updatedProduct = yield prisma_1.default.product.update({
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
                    isActive: discount === null || discount === void 0 ? void 0 : discount.isActive,
                    value: discount === null || discount === void 0 ? void 0 : discount.value,
                }
            }
        },
    });
    return updatedProduct !== null && updatedProduct !== void 0 ? updatedProduct : null;
});
exports.updateProduct = updateProduct;
const getLatestProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const bags = yield prisma_1.default.product.findMany({
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
    });
    if (!bags || bags.length === 0) {
        return null;
    }
    return bags;
});
exports.getLatestProducts = getLatestProducts;
// delete an item from the product
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedProduct = yield prisma_1.default.product.delete({
        where: {
            id: id,
        }
    });
    if (!deletedProduct) {
        return false;
    }
    return true;
});
exports.deleteProduct = deleteProduct;
// check if already in favourite
const isInFavourite = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const favourite = yield prisma_1.default.favourite.findFirst({
        where: {
            userId: userId,
            productId: productId,
        },
    });
    if (!favourite) {
        return false;
    }
    return true;
});
exports.isInFavourite = isInFavourite;
// add to favourite
const addToFavourite = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const favourite = yield prisma_1.default.favourite.create({
        data: {
            productId: productId,
            userId: userId,
        },
    });
    if (!favourite) {
        return false;
    }
    return true;
});
exports.addToFavourite = addToFavourite;
// get favourite products
const getFavouriteProducts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const favouriteProducts = yield prisma_1.default.favourite.findMany({
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
        return null;
    }
    return favouriteProducts.map((favourite) => favourite.product);
});
exports.getFavouriteProducts = getFavouriteProducts;
// delete from favourite
const deleteFavouriteProduct = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const favourite = yield prisma_1.default.favourite.deleteMany({
        where: {
            productId: productId,
            userId: userId,
        },
    });
    if (!favourite) {
        return false;
    }
    return true;
});
exports.deleteFavouriteProduct = deleteFavouriteProduct;
