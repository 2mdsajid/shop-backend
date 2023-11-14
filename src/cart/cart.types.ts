import { param, body, ValidationChain } from 'express-validator';
import { CartItem } from "@prisma/client";



export const createCartItemValidation: ValidationChain[] = [
    body('productId').notEmpty().withMessage('Product ID must be provided').isString().withMessage('Product ID must be a string'),
    body('quantity').notEmpty().withMessage('Quantity must be provided').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
];

export const updateCartItemValidation: ValidationChain[] = [
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    body('productId').notEmpty().withMessage('product id must be a positive integer'),
];

export const deleteCartItemValidation: ValidationChain[] = [
    param('userId').notEmpty().withMessage('User ID must be provided').withMessage('User ID must be provided'),
    body('cartItemId').notEmpty().withMessage('Cart Item ID must be provided').isInt().withMessage('Cart Item ID must be an integer'),
];

