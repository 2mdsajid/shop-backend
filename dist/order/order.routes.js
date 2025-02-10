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
const functions_1 = require("../utils/functions");
const middleware_1 = require("../utils/middleware");
const order_schema_1 = require("./order.schema");
const OrderServices = __importStar(require("./order.services")); // Import the product services
const router = express_1.default.Router();
// generate place-order-token and send to FE 
router.post('/create-order', middleware_1.checkUserExists, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const validationResult = order_schema_1.createOrderSchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ data: null, message: zodErrorElement.message });
        }
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return response.status(400).json({ data: null, message: 'User not found' });
        }
        const orderToken = yield OrderServices.createOrder(request.body, userId);
        if (!orderToken) {
            return response.status(400).json({ data: null, message: 'Token generation failed' });
        }
        return response.status(201).json({ data: orderToken, message: 'Order created' });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
}));
// get place-order token items details from tokens from frontend 
router.get('/confirm-order-token-and-get-details/:token', middleware_1.checkUserExists, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderToken = request.params.token;
        if (!orderToken) {
            return response.status(400).json({ data: null, message: 'No token provided' });
        }
        const orderId = yield OrderServices.verifyOrderTokenAndGetOrderId(orderToken);
        if (!orderId) {
            return response.status(400).json({ data: null, message: 'Unable to verify order token' });
        }
        const orderDetails = yield OrderServices.getOrderById(orderId);
        if (!orderDetails) {
            return response.status(400).json({ data: null, message: 'Unable to get order details' });
        }
        return response.status(201).json({ data: orderDetails, message: "Order details found" });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
}));
// confirm the order items token and then store them and returns the product details
// get all order stats fro dashboard
router.get('/get-all-orders', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield OrderServices.getAllOrders();
        if (!orders || orders.length === 0) {
            return response.status(400).json({ data: null, message: 'No orders found' });
        }
        return response.status(201).json({ data: orders });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
}));
// get single order
router.get('/get-order-by-id/:orderId', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = request.params.orderId;
        if (!orderId || !(0, functions_1.isUUID)(orderId)) {
            return response.status(401).json({ data: null, messsage: 'Missing Some Parameters!' });
        }
        const orderDetails = yield OrderServices.getOrderById(orderId);
        if (!orderDetails) {
            return response.status(400).json({ data: null, message: 'Unable to get order details' });
        }
        return response.status(201).json({ data: orderDetails });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
}));
// update the status of order
router.post('/update-order-status/:orderId', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = request.params.orderId;
        if (!orderId || !(0, functions_1.isUUID)(orderId)) {
            return response.status(401).json({ data: null, messsage: 'Missing Some Parameters!' });
        }
        const validationResult = order_schema_1.updateOrderStatusSchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ data: null, message: zodErrorElement.message });
        }
        const status = request.body.status;
        if (!status || !order_schema_1.orderStatusSchema.safeParse(status).success) {
            return response.status(400).json({ data: null, message: "Invalid status" });
        }
        const updatedOrder = yield OrderServices.updateOrderStatus(status, orderId);
        if (!updatedOrder) {
            return response.status(400).json({ data: null, message: "Failed to update order status" });
        }
        return response.status(200).json({ data: updatedOrder, message: "Order updated successfully" });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: "Internal Server Error" });
    }
}));
// get orders by a user
router.get('/get-orders-by-user-id/:userId', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = request.params.userId;
        if (!userId || !(0, functions_1.isUUID)(userId)) {
            return response.status(401).json({ data: null, messsage: 'Missing Some Parameters!' });
        }
        const orders = yield OrderServices.getOrdersByUserId(userId);
        if (!orders || orders.length === 0) {
            return response.status(400).json({ data: null, message: 'No orders found' });
        }
        return response.status(200).json({ data: orders, message: "Orders fetched successfully" });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: "Internal Server Error" });
    }
}));
exports.default = router;
