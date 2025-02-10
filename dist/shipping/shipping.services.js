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
exports.getShippingAddress = exports.createShippingAddress = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const createShippingAddress = (shippingAddress, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, phoneNumber, address, city, state, pincode } = shippingAddress;
    const newShippingAddress = yield prisma_1.default.shippingAddress.create({
        data: {
            fullName,
            phoneNumber,
            address,
            city,
            state,
            pincode,
            userId
        }
    });
    if (!newShippingAddress)
        return null;
    return newShippingAddress;
});
exports.createShippingAddress = createShippingAddress;
const getShippingAddress = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const shippingAddress = yield prisma_1.default.shippingAddress.findMany({
        where: { userId },
        select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            address: true,
            city: true,
            state: true,
            pincode: true,
        }
    });
    if (!shippingAddress)
        return [];
    return shippingAddress;
});
exports.getShippingAddress = getShippingAddress;
