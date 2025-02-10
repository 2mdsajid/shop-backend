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
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cart_routes_1 = __importDefault(require("./cart/cart.routes"));
const product_routes_1 = __importDefault(require("./product/product.routes"));
const user_routes_1 = __importDefault(require("./user/user.routes"));
const checkout_routes_1 = __importDefault(require("./checkout/checkout.routes"));
const order_routes_1 = __importDefault(require("./order/order.routes"));
const announcement_routes_1 = __importDefault(require("./announcement/announcement.routes"));
const shipping_routes_1 = __importDefault(require("./shipping/shipping.routes"));
dotenv.config();
if (!process.env.PORT) {
    console.log("Please specify port number ");
    process.exit(1);
}
const PORT = parseInt(process.env.PORT, 10) || 3002;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
// Add your routes here
app.use("/announcement", announcement_routes_1.default);
app.use("/cart", cart_routes_1.default);
app.use("/checkout", checkout_routes_1.default);
app.use("/order", order_routes_1.default);
app.use("/product", product_routes_1.default);
app.use("/shipping", shipping_routes_1.default);
app.use("/user", user_routes_1.default);
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json({
            message: 'Hello, please do not cause unnecessary API calls',
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}));
app.listen(PORT, () => {
    console.log(`Listening http://localhost:${PORT}/`);
});
