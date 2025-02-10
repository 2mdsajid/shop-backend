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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const express_1 = __importDefault(require("express"));
const cart_schema_1 = require("./cart.schema");
const CartItemServices = __importStar(require("./cart.services"));
const router = express_1.default.Router();
// get all cart items
router.get('/get-all-cart-items', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartItems = yield CartItemServices.listCartItems();
        if (!cartItems || cartItems.length === 0) {
            return response.status(400).json({ data: null, message: "Cart items not found!" });
        }
        return response.status(200).json({ data: cartItems, message: "Cart items found!" });
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
// get cart items of a user
router.get('/get-cart-items-of-a-user/:userId', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = request.params;
    try {
        const cartItems = yield CartItemServices.listCartItemsByUser(userId);
        return response.status(200).json(cartItems);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
// Create a new cart item
router.post('/create-cart-item-of-a-user/:userId', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = request.params;
    const dataToValidate = Object.assign(Object.assign({}, request.body), { userId });
    const validationResult = cart_schema_1.createCartItemSchema.safeParse(dataToValidate);
    if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0].message;
        return response.status(400).json({ message: errorMessage });
    }
    try {
        const validatedData = validationResult.data;
        const newCartItem = yield CartItemServices.createCartItem(validatedData);
        return response.status(201).json(newCartItem);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
// update cart item
router.post('/update-cart-item/:userId', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = request.params;
    const validationResult = cart_schema_1.updateCartItemSchema.safeParse(request.body);
    if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0].message;
        return response.status(400).json({ message: errorMessage });
    }
    try {
        const validatedData = validationResult.data;
        const updatedCartItem = yield CartItemServices.updateCartItem(validatedData);
        return response.status(200).json(updatedCartItem);
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
router.post('/delete-cart-item/:userId', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = request.params;
    const validationResult = cart_schema_1.deleteCartItemSchema.safeParse(request.body);
    if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0].message;
        return response.status(400).json({ message: errorMessage });
    }
    try {
        yield CartItemServices.deleteCartItem(validationResult.data.id);
        return response.status(204).send();
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
}));
exports.default = router;
