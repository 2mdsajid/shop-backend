import { body, ValidationChain } from 'express-validator';
import { Comment, Rating, Review } from "@prisma/client";

export type TypeBaseProduct = {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    userId: string;
}
export type TypeDetailedProduct = TypeBaseProduct & {
    comments?: Omit<Comment, 'productId'>[]
    reviews?: Review[]
    ratings?: Rating[]
};


export const productValidation: ValidationChain[] = [
  body('name').notEmpty().withMessage('Name must be provided').isString().withMessage('Name must be a string'),
  body('description').notEmpty().withMessage('Description must be provided').isString().withMessage('Description must be a string'),
  body('price').notEmpty().withMessage('Price must be provided').isNumeric().withMessage('Price must be a number'),
  body('imageUrl').notEmpty().withMessage('Image URL must be provided').isString().withMessage('Image URL must be a string'),
  body('userId')
    .notEmpty().withMessage('User ID must be provided').isString().withMessage('User ID must be a string'),
];

export const updateProductValidation: ValidationChain[] = [
    body('name').optional().notEmpty().withMessage('Name must be provided').isString().withMessage('Name must be a string'),
    body('description').optional().notEmpty().withMessage('Description must be provided').isString().withMessage('Description must be a string'),
    body('price').optional().notEmpty().withMessage('Price must be provided').isNumeric().withMessage('Price must be a number'),
    body('imageUrl').optional().notEmpty().withMessage('Image URL must be provided').isString().withMessage('Image URL must be a string'),
    body('userId')
      .optional()
      .notEmpty().withMessage('User ID must be provided').isString().withMessage('User ID must be a string'),
  ];
  
  export const commentValidation: ValidationChain[] = [
    body('content').notEmpty().withMessage('Content must be provided').isString().withMessage('Content must be a string'),
    body('userId').notEmpty().withMessage('User ID must be provided').isString().withMessage('User ID must be a string'),
  ];

  export const reviewValidation: ValidationChain[] = [
    body('title').notEmpty().withMessage('Title must be provided').isString().withMessage('Title must be a string'),
    body('content').notEmpty().withMessage('Content must be provided').isString().withMessage('Content must be a string'),
    body('userId').notEmpty().withMessage('User ID must be provided').isString().withMessage('User ID must be a string'),
  ];

  export const ratingValidation: ValidationChain[] = [
    body('value').notEmpty().withMessage('Rating value must be provided').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    body('userId').notEmpty().withMessage('User ID must be provided').isString().withMessage('User ID must be a string'),
  ];
  