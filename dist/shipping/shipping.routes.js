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
const shipping_schema_1 = require("./shipping.schema");
const middleware_1 = require("../utils/middleware");
const ShippingServices = __importStar(require("./shipping.services"));
const router = express_1.default.Router();
router.post('/create-shipping-address', middleware_1.checkUserExists, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const validationResult = shipping_schema_1.createShippingAddressSchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ data: null, message: zodErrorElement.message });
        }
        // check if user is null
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
        console.log(userId);
        if (!userId) {
            return response.status(404).json({ data: null, message: 'User not found' });
        }
        const validatedData = validationResult.data;
        const newShippingAddress = yield ShippingServices.createShippingAddress(validatedData, userId);
        if (!newShippingAddress) {
            return response.status(400).json({ data: null, message: 'Shipping address not created' });
        }
        return response.status(200).json({ data: newShippingAddress, message: 'Shipping address created' });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
}));
router.get('/get-shipping-address', middleware_1.checkUserExists, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return response.status(404).json({ data: null, message: 'User not found' });
        }
        const shippingAddress = yield ShippingServices.getShippingAddress(userId);
        if (!shippingAddress || shippingAddress.length === 0) {
            return response.status(404).json({ data: null, message: 'Shipping address not found' });
        }
        return response.status(200).json({ data: shippingAddress, message: 'Shipping address found' });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
}));
exports.default = router;
