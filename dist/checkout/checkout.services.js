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
exports.decodeCheckoutToken = exports.generateCheckoutToken = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const checkout_methods_1 = require("./checkout.methods");
// generate checkout token for checkout pages
const generateCheckoutToken = (items) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Expires in 15 minutes
        const checkoutToken = yield prisma_1.default.checkoutToken.create({
            data: {
                token: (0, checkout_methods_1.generateSecureToken)(),
                expiresAt: expiresAt,
                CheckoutTokenItems: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                },
            },
        });
        return checkoutToken.token;
    }
    catch (error) {
        console.log("🚀 ~ generateCheckoutToken ~ error:", error);
        return null;
    }
});
exports.generateCheckoutToken = generateCheckoutToken;
// decode token for checkout
const decodeCheckoutToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkoutToken = yield prisma_1.default.checkoutToken.findUnique({
            where: {
                token: token
            },
            include: {
                CheckoutTokenItems: {
                    select: {
                        id: true,
                        productId: true,
                        quantity: true,
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
                                        isActive: true,
                                        value: true,
                                    }
                                },
                            }
                        }
                    }
                }
            }
        });
        if (!checkoutToken) {
            return null;
        }
        return checkoutToken.CheckoutTokenItems.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            checkoutId: checkoutToken.id,
            product: item.product
        }));
    }
    catch (error) {
        console.log("🚀 ~ decodeCheckoutToken ~ error:", error);
        return null;
    }
});
exports.decodeCheckoutToken = decodeCheckoutToken;
