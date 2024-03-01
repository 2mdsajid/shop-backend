import { body, ValidationChain } from 'express-validator';
import { Comment, Rating, Review } from "@prisma/client";

export type TypeBaseProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  userId: string;
  category: string;
  isFreeDelivery: boolean;
  itemsLeft: number;
  brand: string | null;
  images: string[];
  isNew: boolean | null;
  hasDiscount: {
    state: boolean;
    value: number;
  } | null;
};

export type TypeDetailedProduct = TypeBaseProduct & {
    comments?: Omit<Comment, 'productId'>[]
    reviews?: Review[]
    ratings?: Rating[]
};

export type TItemForCheckout = {
  id: string
  quantity: number
}

export type TItemForPlaceOrder = {
  id: string
  price: number
  quantity: number
}

export type TOrderProductBasic = {
  name: string;
  imageUrl: string;
  category: string;
  price: number;
  quantity: number;
}

export type TOrderStatus = 'created' | 'delivered' | 'shipping'

export type TOrderInfo = {
  id: string;
  createdAt: Date;
  status: string;
}

export type TOrderInfoExtended = TOrderInfo & {
  orderToken: string;
  User: {
    name: string;
    email: string;
  };
}

export type TOrderStatsTable = {
  id: string;
  createdAt: string;
  status: string;
  userName: string;
  userEmail: string;
};

export type ShadCnToast = {
  state: 'success' | 'destructive',
  message: string
}

export const productValidation: ValidationChain[] = [
  body('name').notEmpty().withMessage('Name must be provided').isString().withMessage('Name must be a string'),
  body('description').notEmpty().withMessage('Description must be provided').isString().withMessage('Description must be a string'),
  body('price').notEmpty().withMessage('Price must be provided').isNumeric().withMessage('Price must be a number'),
  body('imageUrl').notEmpty().withMessage('Image URL must be provided').isString().withMessage('Image URL must be a string'),
  body('category').notEmpty().withMessage('Category must be provided').isString().withMessage('Category must be a string'),
  body('isFreeDelivery').optional().isBoolean().withMessage('isFreeDelivery must be a boolean'),
  body('itemsLeft').optional().isInt().withMessage('Items Left must be an integer'),
  body('brand').optional().isString().withMessage('Brand must be a string'),
  body('images').optional().isArray().withMessage('Images must be an array'),
  body('isNew').optional().isBoolean().withMessage('isNew must be a boolean'),
  body('hasDiscount').optional().isObject().withMessage('hasDiscount must be an object'),
  body('hasDiscount.state').optional().isBoolean().withMessage('hasDiscount.state must be a boolean'),
  body('hasDiscount.value').optional().isInt().withMessage('hasDiscount.value must be an integer'),
  body('userId')
    .notEmpty().withMessage('User ID must be provided').isString().withMessage('User ID must be a string'),
];

export const itemsForCheckoutValidation: ValidationChain[] = [
  body()
    .isArray({ min: 1 })
    .withMessage('Items must be provided as an array with at least one item'),
  body('*')
    .isObject()
    .withMessage('Each item must be an object')
    .bail()
    .custom((value: any) => {
      // Check that each item has 'id' and 'quantity' fields
      if (!value.id || !value.quantity) {
        throw new Error('Each item must have "id" and "quantity" fields');
      }
      return true;
    }),
  body('*.*.id')
    .notEmpty()
    .withMessage('Item ID must be provided')
    .isString()
    .withMessage('Item ID must be a string'),
  body('*.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
];

// it has id, quantity and price as objects array
export const itemsForPlaceOrderValidation: ValidationChain[] = [
  body()
    .isArray({ min: 1 })
    .withMessage('Items must be provided as an array with at least one item'),
  body('*')
    .isObject()
    .withMessage('Each item must be an object')
    .bail()
    .custom((value: any) => {
      // Check that each item has 'id' and 'quantity' fields
      if (!value.id || !value.quantity || !value.price) {
        throw new Error('Each item must have "id" and "quantity" and "price" fields');
      }
      return true;
    }),
  body('*.*.id')
    .notEmpty()
    .withMessage('Item ID must be provided')
    .isString()
    .withMessage('Item ID must be a string'),
  body('*.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('*.*.price')
    .isInt({ min: 1 })
    .withMessage('price must be a positive integer'),
];


export const updateProductValidation: ValidationChain[] = [
export const getTokenItemsValidation: ValidationChain[] = [
  body('token').notEmpty().withMessage('Content must be provided').isString().withMessage('Content must be a string'),
];

export const updateOrderStatusValidation: ValidationChain[] = [
  body('status')
    .notEmpty().withMessage('Status must be provided')
    .isString().withMessage('Status must be a string')
    .custom((value: string) => {
      const validStatuses = ['created', 'delivered', 'shipping'];
      if (!validStatuses.includes(value)) {
        throw new Error('Invalid status');
      }
      return true;
    }),
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
  