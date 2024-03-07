"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var express_1 = __importDefault(require("express"));
var express_validator_1 = require("express-validator");
var middleware_1 = require("../utils/middleware");
var ProductServices = __importStar(require("./product.services")); // Import the product services
var product_types_1 = require("./product.types");
var router = express_1.default.Router();
// get product categories
router.get('/get-categories', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var categories, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, ProductServices.getProductCategories()];
            case 1:
                categories = _a.sent();
                return [2 /*return*/, response.status(200).json({ data: categories })];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, response.status(500).json({ data: null, message: error_1.message })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// get products by categories
router.get('/get-products-by-category/:category', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var category, products, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                category = request.params.category;
                if (!category) {
                    return [2 /*return*/, response.status(404).json({ data: null, message: 'No category' })];
                }
                return [4 /*yield*/, ProductServices.getProductsByCategory(category)];
            case 1:
                products = _a.sent();
                return [2 /*return*/, response.status(200).json({ data: products })];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, response.status(500).json({ data: null, message: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// // GET: List of all Products
router.get("/get-all", function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var products, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, ProductServices.listProducts()];
            case 1:
                products = _a.sent();
                return [2 /*return*/, response.status(200).json({ data: products })];
            case 2:
                error_3 = _a.sent();
                return [2 /*return*/, response.status(500).json({ data: null, message: error_3.message })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET: Get a single Product by ID
router.get("/get/:productId", function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, product, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                productId = request.params.productId;
                return [4 /*yield*/, ProductServices.getProductById(productId)];
            case 1:
                product = _a.sent();
                if (!product) {
                    return [2 /*return*/, response.status(404).json({ data: null, message: 'Product Doesn\'t Exist' })];
                }
                return [2 /*return*/, response.status(200).json({ data: product })];
            case 2:
                error_4 = _a.sent();
                return [2 /*return*/, response.status(500).json({ data: null, message: 'Internal Server Error' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/get-latest', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var latestBags, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, ProductServices.getLatestProduct()];
            case 1:
                latestBags = _a.sent();
                return [2 /*return*/, response.status(201).json({ data: latestBags, message: 'Fetched Latest Products' })];
            case 2:
                error_5 = _a.sent();
                return [2 /*return*/, response.status(500).json({ data: null, message: 'Internal Server Error' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// // POST: Create a new Product
router.post("/add", middleware_1.checkUserExists, product_types_1.productValidation, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, newProduct, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                errors = (0, express_validator_1.validationResult)(request);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, response.status(400).json({ message: errors.array()[0].msg })];
                }
                return [4 /*yield*/, ProductServices.createProduct(request.body)];
            case 1:
                newProduct = _a.sent();
                return [2 /*return*/, response.status(201).json({
                        message: "product created",
                        newProduct: newProduct
                    })];
            case 2:
                error_6 = _a.sent();
                return [2 /*return*/, response.status(500).json({ message: error_6.message })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// delete a product from the DB
router.get('/delete/:productId', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, product, responseMessage_1, responseMessage, error_7, responseMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                productId = request.params.productId;
                return [4 /*yield*/, ProductServices.getProductById(productId)];
            case 1:
                product = _a.sent();
                if (!product) {
                    responseMessage_1 = { state: 'destructive', message: 'Product Doesn\'t Exist' };
                    return [2 /*return*/, response.status(404).json(responseMessage_1)];
                }
                return [4 /*yield*/, ProductServices.deleteProduct(productId)];
            case 2:
                _a.sent();
                responseMessage = { state: 'success', message: 'Product Deleted Successfully' };
                return [2 /*return*/, response.status(200).json(responseMessage)];
            case 3:
                error_7 = _a.sent();
                responseMessage = { state: 'destructive', message: 'Internal Server Error!' };
                return [2 /*return*/, response.status(500).json(responseMessage)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Update a Product by ID
router.post("/update/:productId", product_types_1.productValidation, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, productId, product, responseMessage_2, responseMessage, error_8, responseMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                errors = (0, express_validator_1.validationResult)(request);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, response.status(400).json({ message: errors.array()[0].msg })];
                }
                productId = request.params.productId;
                return [4 /*yield*/, ProductServices.getProductById(productId)];
            case 1:
                product = _a.sent();
                if (!product) {
                    responseMessage_2 = { state: 'destructive', message: 'Product Doesn\'t Exist' };
                    return [2 /*return*/, response.status(404).json(responseMessage_2)];
                }
                return [4 /*yield*/, ProductServices.updateProduct(productId, request.body)];
            case 2:
                _a.sent();
                responseMessage = { state: 'success', message: 'Product Updated Successfully!' };
                return [2 /*return*/, response.status(201).json(responseMessage)];
            case 3:
                error_8 = _a.sent();
                responseMessage = { state: 'destructive', message: 'Internal Server Error!' };
                return [2 /*return*/, response.status(500).json(responseMessage)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// generate checkout token and send to FE 
router.post('/generate-checkout-token', product_types_1.itemsForCheckoutValidation, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, checkoutToken;
    return __generator(this, function (_a) {
        try {
            errors = (0, express_validator_1.validationResult)(request.body);
            if (!errors.isEmpty()) {
                return [2 /*return*/, response.status(400).json({ data: null, message: errors.array()[0].msg })];
            }
            checkoutToken = ProductServices.generateCheckoutToken(request.body);
            return [2 /*return*/, response.status(201).json({ data: checkoutToken, message: 'Fetched Latest Products' })];
        }
        catch (error) {
            return [2 /*return*/, response.status(500).json({ data: null, message: 'Internal Server Error' })];
        }
        return [2 /*return*/];
    });
}); });
// generate place-order-token and send to FE 
router.post('/generate-place-order-token', product_types_1.itemsForPlaceOrderValidation, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, checkoutToken;
    return __generator(this, function (_a) {
        try {
            errors = (0, express_validator_1.validationResult)(request.body);
            if (!errors.isEmpty()) {
                return [2 /*return*/, response.status(400).json({ data: null, message: errors.array()[0].msg })];
            }
            checkoutToken = ProductServices.generatePlaceOrderToken(request.body);
            return [2 /*return*/, response.status(201).json({ data: checkoutToken, message: 'Token generated' })];
        }
        catch (error) {
            return [2 /*return*/, response.status(500).json({ data: null, message: 'Internal Server Error' })];
        }
        return [2 /*return*/];
    });
}); });
// get checkout token items details from based on tokens from frontend 
router.post('/get-checkout-token-items', product_types_1.getTokenItemsValidation, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, checkoutTokenItems, products, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                errors = (0, express_validator_1.validationResult)(request.body);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, response.status(400).json({ data: null, message: errors.array()[0].msg })];
                }
                checkoutTokenItems = ProductServices.decodeCheckoutToken(request.body.token);
                return [4 /*yield*/, Promise.all(checkoutTokenItems.map(function (product) { return __awaiter(void 0, void 0, void 0, function () {
                        var productDetails;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, ProductServices.getProductById(product.id)];
                                case 1:
                                    productDetails = _a.sent();
                                    return [2 /*return*/, {
                                            details: productDetails,
                                            quantity: product.quantity,
                                        }];
                            }
                        });
                    }); }))];
            case 1:
                products = _a.sent();
                return [2 /*return*/, response.status(201).json({ data: products })];
            case 2:
                error_9 = _a.sent();
                return [2 /*return*/, response.status(500).json({ data: null, message: 'Internal Server Error' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// probably not used
// get place-order token items details from tokens from frontend 
router.post('/get-place-order-token-items', product_types_1.getTokenItemsValidation, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, checkoutTokenItems, products, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                errors = (0, express_validator_1.validationResult)(request.body);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, response.status(400).json({ data: null, message: errors.array()[0].msg })];
                }
                checkoutTokenItems = ProductServices.decodePlaceOrderToken(request.body.token);
                return [4 /*yield*/, Promise.all(checkoutTokenItems.map(function (product) { return __awaiter(void 0, void 0, void 0, function () {
                        var productDetails;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, ProductServices.getProductById(product.id)];
                                case 1:
                                    productDetails = _a.sent();
                                    return [2 /*return*/, {
                                            details: productDetails,
                                            price: product.price,
                                            quantity: product.quantity,
                                        }];
                            }
                        });
                    }); }))];
            case 1:
                products = _a.sent();
                return [2 /*return*/, response.status(201).json({ data: products })];
            case 2:
                error_10 = _a.sent();
                return [2 /*return*/, response.status(500).json({ data: null, message: 'Internal Server Error' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// confirm the order items token and then store them and returns the product details
router.post('/confirm-and-get-place-order-items', product_types_1.getTokenItemsValidation, middleware_1.checkUserExists, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, userId, orderInfo, checkoutTokenItems, products, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                errors = (0, express_validator_1.validationResult)(request.body);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, response.status(400).json({ data: null, message: errors.array()[0].msg })];
                }
                userId = request.userId;
                return [4 /*yield*/, ProductServices.storeOrderTokenToDatabase(request.body.token, userId)
                    // save order items to db
                    // fetch the order details from db
                ];
            case 1:
                orderInfo = _a.sent();
                checkoutTokenItems = ProductServices.decodePlaceOrderToken(request.body.token);
                return [4 /*yield*/, ProductServices.storeOrderItems(checkoutTokenItems, orderInfo.id)];
            case 2:
                _a.sent();
                return [4 /*yield*/, Promise.all(checkoutTokenItems.map(function (product) { return __awaiter(void 0, void 0, void 0, function () {
                        var productDetails;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, ProductServices.getProductById(product.id)];
                                case 1:
                                    productDetails = _a.sent();
                                    return [2 /*return*/, {
                                            name: productDetails === null || productDetails === void 0 ? void 0 : productDetails.name,
                                            imageUrl: productDetails === null || productDetails === void 0 ? void 0 : productDetails.imageUrl,
                                            category: productDetails === null || productDetails === void 0 ? void 0 : productDetails.category,
                                            price: product.price,
                                            quantity: product.quantity,
                                        }];
                            }
                        });
                    }); }))];
            case 3:
                products = _a.sent();
                return [2 /*return*/, response.status(201).json({ data: { products: products, orderInfo: orderInfo } })];
            case 4:
                error_11 = _a.sent();
                return [2 /*return*/, response.status(500).json({ data: null, message: 'Internal Server Error' })];
            case 5: return [2 /*return*/];
        }
    });
}); });
// get all order stats fro dashboard
router.get('/get-all-orders', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var allOrders, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, ProductServices.getAllOrders()];
            case 1:
                allOrders = _a.sent();
                return [2 /*return*/, response.status(201).json({ data: allOrders })];
            case 2:
                error_12 = _a.sent();
                return [2 /*return*/, response.status(500).json({ data: null, message: 'Internal Server Error' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// get single order
router.get('/get-order/:orderId', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, _a, products, orderInfo, error_13;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                orderId = request.params.orderId;
                if (!orderId) {
                    return [2 /*return*/, response.status(401).json({ data: null, messsage: 'Missing Some Parameters!' })];
                }
                return [4 /*yield*/, ProductServices.getOrderById(orderId)];
            case 1:
                _a = _b.sent(), products = _a.products, orderInfo = _a.orderInfo;
                return [2 /*return*/, response.status(201).json({ data: { products: products, orderInfo: orderInfo } })];
            case 2:
                error_13 = _b.sent();
                return [2 /*return*/, response.status(500).json({ data: null, message: 'Internal Server Error' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// update the status of order
router.post('/update-order-status/:orderId', product_types_1.updateOrderStatusValidation, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, responseMessage_3, errors, responseMessage, error_14, responseMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderId = request.params.orderId;
                if (!orderId) {
                    responseMessage_3 = { state: 'destructive', message: 'Order ID missing' };
                    return [2 /*return*/, response.status(400).json(responseMessage_3)];
                }
                errors = (0, express_validator_1.validationResult)(request.body);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, response.status(400).json({ data: null, message: errors.array()[0].msg })];
                }
                return [4 /*yield*/, ProductServices.updateOrderStatus(request.body.status, orderId)];
            case 1:
                _a.sent();
                responseMessage = { state: 'success', message: 'Order Status updated successfully!' };
                return [2 /*return*/, response.status(200).json(responseMessage)];
            case 2:
                error_14 = _a.sent();
                responseMessage = { state: 'destructive', message: 'Internal Server Error!' };
                return [2 /*return*/, response.status(500).json(responseMessage)];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
