"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCartItemValidation = exports.updateCartItemValidation = exports.createCartItemValidation = void 0;
var express_validator_1 = require("express-validator");
exports.createCartItemValidation = [
    (0, express_validator_1.body)('productId').notEmpty().withMessage('Product ID must be provided').isString().withMessage('Product ID must be a string'),
    (0, express_validator_1.body)('quantity').notEmpty().withMessage('Quantity must be provided').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
];
exports.updateCartItemValidation = [
    (0, express_validator_1.body)('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    (0, express_validator_1.body)('productId').notEmpty().withMessage('product id must be a positive integer'),
];
exports.deleteCartItemValidation = [
    (0, express_validator_1.param)('userId').notEmpty().withMessage('User ID must be provided').withMessage('User ID must be provided'),
    (0, express_validator_1.body)('cartItemId').notEmpty().withMessage('Cart Item ID must be provided').isInt().withMessage('Cart Item ID must be an integer'),
];
