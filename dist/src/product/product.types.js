"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingValidation = exports.reviewValidation = exports.commentValidation = exports.updateOrderStatusValidation = exports.getTokenItemsValidation = exports.itemsForPlaceOrderValidation = exports.itemsForCheckoutValidation = exports.productValidation = void 0;
var express_validator_1 = require("express-validator");
exports.productValidation = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name must be provided').isString().withMessage('Name must be a string'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description must be provided').isString().withMessage('Description must be a string'),
    (0, express_validator_1.body)('price').notEmpty().withMessage('Price must be provided').isNumeric().withMessage('Price must be a number'),
    (0, express_validator_1.body)('imageUrl').notEmpty().withMessage('Image URL must be provided').isString().withMessage('Image URL must be a string'),
    (0, express_validator_1.body)('category').notEmpty().withMessage('Category must be provided').isString().withMessage('Category must be a string'),
    (0, express_validator_1.body)('isFreeDelivery').optional().isBoolean().withMessage('isFreeDelivery must be a boolean'),
    (0, express_validator_1.body)('itemsLeft').optional().isInt().withMessage('Items Left must be an integer'),
    (0, express_validator_1.body)('brand').optional().isString().withMessage('Brand must be a string'),
    (0, express_validator_1.body)('images').optional().isArray().withMessage('Images must be an array'),
    (0, express_validator_1.body)('isNew').optional().isBoolean().withMessage('isNew must be a boolean'),
    (0, express_validator_1.body)('hasDiscount').optional().isObject().withMessage('hasDiscount must be an object'),
    (0, express_validator_1.body)('hasDiscount.state').optional().isBoolean().withMessage('hasDiscount.state must be a boolean'),
    (0, express_validator_1.body)('hasDiscount.value').optional().isInt().withMessage('hasDiscount.value must be an integer'),
    (0, express_validator_1.body)('userId')
        .notEmpty().withMessage('User ID must be provided').isString().withMessage('User ID must be a string'),
];
exports.itemsForCheckoutValidation = [
    (0, express_validator_1.body)()
        .isArray({ min: 1 })
        .withMessage('Items must be provided as an array with at least one item'),
    (0, express_validator_1.body)('*')
        .isObject()
        .withMessage('Each item must be an object')
        .bail()
        .custom(function (value) {
        // Check that each item has 'id' and 'quantity' fields
        if (!value.id || !value.quantity) {
            throw new Error('Each item must have "id" and "quantity" fields');
        }
        return true;
    }),
    (0, express_validator_1.body)('*.*.id')
        .notEmpty()
        .withMessage('Item ID must be provided')
        .isString()
        .withMessage('Item ID must be a string'),
    (0, express_validator_1.body)('*.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer'),
];
// it has id, quantity and price as objects array
exports.itemsForPlaceOrderValidation = [
    (0, express_validator_1.body)()
        .isArray({ min: 1 })
        .withMessage('Items must be provided as an array with at least one item'),
    (0, express_validator_1.body)('*')
        .isObject()
        .withMessage('Each item must be an object')
        .bail()
        .custom(function (value) {
        // Check that each item has 'id' and 'quantity' fields
        if (!value.id || !value.quantity || !value.price) {
            throw new Error('Each item must have "id" and "quantity" and "price" fields');
        }
        return true;
    }),
    (0, express_validator_1.body)('*.*.id')
        .notEmpty()
        .withMessage('Item ID must be provided')
        .isString()
        .withMessage('Item ID must be a string'),
    (0, express_validator_1.body)('*.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer'),
    (0, express_validator_1.body)('*.*.price')
        .isInt({ min: 1 })
        .withMessage('price must be a positive integer'),
];
exports.getTokenItemsValidation = [
    (0, express_validator_1.body)('token').notEmpty().withMessage('Content must be provided').isString().withMessage('Content must be a string'),
];
exports.updateOrderStatusValidation = [
    (0, express_validator_1.body)('status')
        .notEmpty().withMessage('Status must be provided')
        .isString().withMessage('Status must be a string')
        .custom(function (value) {
        var validStatuses = ['created', 'delivered', 'shipping'];
        if (!validStatuses.includes(value)) {
            throw new Error('Invalid status');
        }
        return true;
    }),
];
exports.commentValidation = [
    (0, express_validator_1.body)('content').notEmpty().withMessage('Content must be provided').isString().withMessage('Content must be a string'),
    (0, express_validator_1.body)('userId').notEmpty().withMessage('User ID must be provided').isString().withMessage('User ID must be a string'),
];
exports.reviewValidation = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title must be provided').isString().withMessage('Title must be a string'),
    (0, express_validator_1.body)('content').notEmpty().withMessage('Content must be provided').isString().withMessage('Content must be a string'),
    (0, express_validator_1.body)('userId').notEmpty().withMessage('User ID must be provided').isString().withMessage('User ID must be a string'),
];
exports.ratingValidation = [
    (0, express_validator_1.body)('value').notEmpty().withMessage('Rating value must be provided').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    (0, express_validator_1.body)('userId').notEmpty().withMessage('User ID must be provided').isString().withMessage('User ID must be a string'),
];
