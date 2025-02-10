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
const product_services_1 = require("../product/product.services");
const checkout_schema_1 = require("./checkout.schema");
const CheckoutServices = __importStar(require("./checkout.services")); // Import the product services
const router = express_1.default.Router();
// generate checkout token and send to FE 
router.post('/generate-checkout-token', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = checkout_schema_1.checkoutTokenRequestSchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ data: null, message: zodErrorElement.message });
        }
        // Check if all products exist
        const productsExist = yield Promise.all(request.body.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield (0, product_services_1.getProductDetailById)(item.productId);
            return product !== null;
        })));
        if (productsExist.includes(false)) {
            return response.status(400).json({ data: null, message: 'One or more products not found' });
        }
        const checkoutToken = yield CheckoutServices.generateCheckoutToken(request.body);
        if (!checkoutToken) {
            return response.status(400).json({ data: null, message: 'Token generation failed' });
        }
        return response.status(201).json({ data: checkoutToken, message: 'Checkout Token Generated' });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
}));
// get checkout token items details from based on tokens from frontend 
router.get('/get-checkout-token-items-details/:token', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkoutToken = request.params.token;
        if (!checkoutToken) {
            return response.status(400).json({ data: null, message: 'No checkout token provided' });
        }
        const checkoutTokenItems = yield CheckoutServices.decodeCheckoutToken(checkoutToken);
        if (!checkoutTokenItems || checkoutTokenItems.length === 0) {
            return response.status(400).json({ data: null, message: 'No checkout token items found' });
        }
        return response.status(201).json({ data: checkoutTokenItems, message: 'Checkout Token Items Details Fetched' });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
}));
//   // generate place-order-token and send to FE 
//   router.post('/generate-place-order-token', async (request: Request, response: Response) => {
//     try {
//       const errors = validationResult(request.body);
//       if (!errors.isEmpty()) {
//         return response.status(400).json({ data: null, message: errors.array()[0].msg });
//       }
//       const checkoutToken = ProductServices.generatePlaceOrderToken(request.body)
//       return response.status(201).json({ data: checkoutToken, message: 'Token generated' });
//     } catch (error) {
//       return response.status(500).json({ data: null, message: 'Internal Server Error' });
//     }
//   })
//   // probably not used
//   // get place-order token items details from tokens from frontend 
//   router.post('/get-place-order-token-items', getTokenItemsValidation, async (request: Request, response: Response) => {
//     try {
//       const errors = validationResult(request.body);
//       if (!errors.isEmpty()) {
//         return response.status(400).json({ data: null, message: errors.array()[0].msg });
//       }
//       const checkoutTokenItems = ProductServices.decodePlaceOrderToken(request.body.token)
//       const products = await Promise.all(
//         checkoutTokenItems.map(async (product) => {
//           const productDetails = await ProductServices.getProductById(product.id);
//           return {
//             details: productDetails,
//             price: product.price,
//             quantity: product.quantity,
//           };
//         })
//       );
//       return response.status(201).json({ data: products });
//     } catch (error) {
//       return response.status(500).json({ data: null, message: 'Internal Server Error' });
//     }
//   })
//   // confirm the order items token and then store them and returns the product details
//   router.post('/confirm-and-get-place-order-items', getTokenItemsValidation, checkUserExists, async (request: RequestWithUserId, response: Response) => {
//     try {
//       const errors = validationResult(request.body);
//       if (!errors.isEmpty()) {
//         return response.status(400).json({ data: null, message: errors.array()[0].msg });
//       }
//       // fetch the order info from db by saving the order details
//       const userId = request.userId as string;
//       const orderInfo = await ProductServices.storeOrderTokenToDatabase(request.body.token, userId)
//       // save order items to db
//       // fetch the order details from db
//       const checkoutTokenItems = ProductServices.decodePlaceOrderToken(request.body.token)
//       await ProductServices.storeOrderItems(checkoutTokenItems, orderInfo.id)
//       const products = await Promise.all(
//         checkoutTokenItems.map(async (product) => {
//           const productDetails = await ProductServices.getProductById(product.id);
//           return {
//             name: productDetails?.name,
//             imageUrl: productDetails?.imageUrl,
//             category: productDetails?.category,
//             price: product.price,
//             quantity: product.quantity,
//           };
//         })
//       );
//       return response.status(201).json({ data: { products, orderInfo } });
//     } catch (error) {
//       return response.status(500).json({ data: null, message: 'Internal Server Error' });
//     }
//   })
exports.default = router;
