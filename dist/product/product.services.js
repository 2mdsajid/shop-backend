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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrderById = exports.getAllOrders = exports.deleteProduct = exports.storeOrderTokenToDatabase = exports.storeOrderItems = exports.decodePlaceOrderToken = exports.generatePlaceOrderToken = exports.decodeCheckoutToken = exports.generateCheckoutToken = exports.getLatestProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.listProducts = exports.getProductsByCategory = exports.getProductCategories = void 0;
var prisma_1 = __importDefault(require("../utils/prisma"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var getProductCategories = function () { return __awaiter(void 0, void 0, void 0, function () {
    var categories;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.product.findMany({
                    distinct: ['category'],
                })];
            case 1:
                categories = _a.sent();
                return [2 /*return*/, categories.map(function (product) { return product.category; })];
        }
    });
}); };
exports.getProductCategories = getProductCategories;
var getProductsByCategory = function (category) { return __awaiter(void 0, void 0, void 0, function () {
    var products;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.product.findMany({
                    where: {
                        category: category,
                    },
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                        imageUrl: true,
                        category: true,
                        userId: true,
                        isFreeDelivery: true,
                        itemsLeft: true,
                        brand: true,
                        images: true,
                        isNew: true,
                        hasDiscount: true,
                    },
                })];
            case 1:
                products = _a.sent();
                return [2 /*return*/, products];
        }
    });
}); };
exports.getProductsByCategory = getProductsByCategory;
var listProducts = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, prisma_1.default.product.findMany({
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    imageUrl: true,
                    category: true,
                    userId: true,
                    isFreeDelivery: true,
                    itemsLeft: true,
                    brand: true,
                    images: true,
                    isNew: true,
                    hasDiscount: true,
                },
            })];
    });
}); };
exports.listProducts = listProducts;
var getProductById = function (productId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, prisma_1.default.product.findUnique({
                where: {
                    id: productId,
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    imageUrl: true,
                    category: true,
                    isFreeDelivery: true,
                    itemsLeft: true,
                    brand: true,
                    images: true,
                    userId: true,
                    isNew: true,
                    hasDiscount: {
                        select: {
                            state: true,
                            value: true,
                        }
                    },
                },
            })];
    });
}); };
exports.getProductById = getProductById;
var createProduct = function (productData) { return __awaiter(void 0, void 0, void 0, function () {
    var name_1, description, price, imageUrl, category, isFreeDelivery, itemsLeft, brand, images, isNew, hasDiscount, userId, product, baseProduct, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                name_1 = productData.name, description = productData.description, price = productData.price, imageUrl = productData.imageUrl, category = productData.category, isFreeDelivery = productData.isFreeDelivery, itemsLeft = productData.itemsLeft, brand = productData.brand, images = productData.images, isNew = productData.isNew, hasDiscount = productData.hasDiscount, userId = productData.userId;
                return [4 /*yield*/, prisma_1.default.product.create({
                        data: {
                            name: name_1,
                            description: description,
                            price: price,
                            imageUrl: imageUrl,
                            category: category,
                            isFreeDelivery: isFreeDelivery,
                            itemsLeft: itemsLeft,
                            brand: brand,
                            images: images,
                            isNew: isNew,
                            userId: userId,
                        },
                    })];
            case 1:
                product = _a.sent();
                if (!hasDiscount) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma_1.default.discount.create({
                        data: {
                            state: hasDiscount.state,
                            value: hasDiscount.value,
                            productId: product.id,
                        },
                    })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, prisma_1.default.product.findUnique({
                    where: { id: product.id },
                    select: {
                        name: true,
                        hasDiscount: true
                    }
                })];
            case 4:
                baseProduct = _a.sent();
                return [2 /*return*/, baseProduct];
            case 5:
                error_1 = _a.sent();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createProduct = createProduct;
// update an item from the product
var updateProduct = function (productId, productData) { return __awaiter(void 0, void 0, void 0, function () {
    var name, description, price, imageUrl, category, isFreeDelivery, itemsLeft, brand, images, isNew, hasDiscount, userId, updatedProduct;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = productData.name, description = productData.description, price = productData.price, imageUrl = productData.imageUrl, category = productData.category, isFreeDelivery = productData.isFreeDelivery, itemsLeft = productData.itemsLeft, brand = productData.brand, images = productData.images, isNew = productData.isNew, hasDiscount = productData.hasDiscount, userId = productData.userId;
                return [4 /*yield*/, prisma_1.default.product.update({
                        where: {
                            id: productId,
                        },
                        data: {
                            name: name,
                            description: description,
                            price: price,
                            imageUrl: imageUrl,
                            category: category,
                            isFreeDelivery: isFreeDelivery,
                            itemsLeft: itemsLeft,
                            brand: brand,
                            images: images,
                            isNew: isNew,
                        },
                    })];
            case 1:
                updatedProduct = _a.sent();
                if (!hasDiscount) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma_1.default.discount.upsert({
                        where: {
                            productId: productId,
                        },
                        update: {
                            state: hasDiscount.state,
                            value: hasDiscount.value,
                        },
                        create: {
                            state: hasDiscount.state,
                            value: hasDiscount.value,
                            productId: updatedProduct.id,
                        },
                    })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateProduct = updateProduct;
var getLatestProduct = function () { return __awaiter(void 0, void 0, void 0, function () {
    var bags;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.product.findMany({
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
                        itemsLeft: true,
                        brand: true,
                        images: true,
                        isNew: true,
                        hasDiscount: true,
                    },
                })];
            case 1:
                bags = _a.sent();
                return [2 /*return*/, bags];
        }
    });
}); };
exports.getLatestProduct = getLatestProduct;
// generate checkout token for checkout pages
var generateCheckoutToken = function (items) {
    var payload = { items: items };
    var secret = process.env.CHECKOUT_JWT_TOKEN;
    var token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '20m' });
    return token;
};
exports.generateCheckoutToken = generateCheckoutToken;
// decode token for checkout
var decodeCheckoutToken = function (token) {
    var secret = process.env.CHECKOUT_JWT_TOKEN;
    var decoded = jsonwebtoken_1.default.verify(token, secret);
    return decoded.items;
};
exports.decodeCheckoutToken = decodeCheckoutToken;
// generate checkout token for checkout pages
var generatePlaceOrderToken = function (items) {
    var payload = { items: items };
    var secret = process.env.CHECKOUT_JWT_TOKEN;
    var token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '20m' });
    return token;
};
exports.generatePlaceOrderToken = generatePlaceOrderToken;
// decode token for checkout
var decodePlaceOrderToken = function (token) {
    var secret = process.env.CHECKOUT_JWT_TOKEN;
    var decoded = jsonwebtoken_1.default.verify(token, secret);
    return decoded.items;
};
exports.decodePlaceOrderToken = decodePlaceOrderToken;
// aving the items in an order
//  to retrive them by this method .. not by jwt token
var storeOrderItems = function (items, orderId) { return __awaiter(void 0, void 0, void 0, function () {
    var orderItemsData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orderItemsData = items.map(function (item) { return ({
                    productId: item.id,
                    price: item.price,
                    quantity: item.quantity,
                    orderId: orderId,
                }); });
                return [4 /*yield*/, prisma_1.default.orderItem.createMany({
                        data: orderItemsData,
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.storeOrderItems = storeOrderItems;
// storign the ordertoken in the respective user database
var storeOrderTokenToDatabase = function (token, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var newOrder;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.order.create({
                    data: {
                        userId: userId,
                        orderToken: token
                    },
                    select: {
                        id: true,
                        createdAt: true,
                        status: true
                    }
                })];
            case 1:
                newOrder = _a.sent();
                return [2 /*return*/, newOrder];
        }
    });
}); };
exports.storeOrderTokenToDatabase = storeOrderTokenToDatabase;
// delete an item from the product
var deleteProduct = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.product.delete({
                    where: {
                        id: id,
                    }
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.deleteProduct = deleteProduct;
// get all orders for dashboard -- admin
var getAllOrders = function () { return __awaiter(void 0, void 0, void 0, function () {
    var allOrders, ordersStatsTable;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.order.findMany({
                    select: {
                        id: true,
                        createdAt: true,
                        status: true,
                        User: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                })];
            case 1:
                allOrders = _a.sent();
                if (!allOrders || allOrders.length === 0) {
                    return [2 /*return*/, null];
                }
                ordersStatsTable = allOrders.map(function (order) {
                    return {
                        id: order.id,
                        createdAt: order.createdAt.toISOString(),
                        status: order.status,
                        userName: order.User.name,
                        userEmail: order.User.email,
                    };
                });
                return [2 /*return*/, ordersStatsTable];
        }
    });
}); };
exports.getAllOrders = getAllOrders;
// get a singl order  -- admin mb
var getOrderById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var order, products, orderInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.order.findUnique({
                    where: {
                        id: id,
                    },
                    include: {
                        orderItems: {
                            select: {
                                price: true,
                                quantity: true,
                                Product: {
                                    select: {
                                        name: true,
                                        imageUrl: true,
                                        category: true,
                                    }
                                }
                            }
                        }
                    }
                })];
            case 1:
                order = _a.sent();
                if (!order)
                    throw new Error();
                products = (order === null || order === void 0 ? void 0 : order.orderItems.map(function (item) { return ({
                    name: item.Product.name,
                    imageUrl: item.Product.imageUrl,
                    category: item.Product.category,
                    price: item.price,
                    quantity: item.quantity,
                }); })) || [];
                orderInfo = {
                    id: order.id,
                    createdAt: order.createdAt,
                    status: order.status,
                };
                return [2 /*return*/, { products: products, orderInfo: orderInfo }];
        }
    });
}); };
exports.getOrderById = getOrderById;
// to update the order status of specific order
var updateOrderStatus = function (status, orderId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.order.update({
                    where: {
                        id: orderId,
                    },
                    data: {
                        status: status
                    }
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.updateOrderStatus = updateOrderStatus;
