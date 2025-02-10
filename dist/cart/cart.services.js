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
exports.deleteCartItem = exports.updateCartItem = exports.createCartItem = exports.listCartItemsByUser = exports.listCartItems = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const listCartItems = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.cartItem.findMany();
});
exports.listCartItems = listCartItems;
const listCartItemsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.cartItem.findMany({
        where: {
            userId: userId,
        },
    });
});
exports.listCartItemsByUser = listCartItemsByUser;
const createCartItem = (createCartItemData) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, productId, quantity } = createCartItemData;
    const existingCartItem = yield prisma_1.default.cartItem.findUnique({
        where: {
            productId_userId: {
                productId,
                userId,
            },
        },
    });
    if (existingCartItem) {
        return prisma_1.default.cartItem.update({
            where: {
                id: existingCartItem.id,
            },
            data: {
                quantity: existingCartItem.quantity + quantity,
            },
        });
    }
    else {
        return prisma_1.default.cartItem.create({
            data: {
                userId,
                productId,
                quantity,
            },
        });
    }
});
exports.createCartItem = createCartItem;
const updateCartItem = (updateCartItemData) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, productId, quantity } = updateCartItemData;
    const updatedCartItem = yield prisma_1.default.cartItem.update({
        where: {
            id: id,
        },
        data: {
            quantity: quantity
        }
    });
    return updatedCartItem;
});
exports.updateCartItem = updateCartItem;
const deleteCartItem = (cartItemId) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedCartItem = yield prisma_1.default.cartItem.delete({
        where: {
            id: cartItemId,
        },
    });
    return deletedCartItem;
});
exports.deleteCartItem = deleteCartItem;
