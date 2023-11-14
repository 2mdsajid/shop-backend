import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { createCartItemValidation, deleteCartItemValidation, updateCartItemValidation } from './cart.types';
import * as CartItemServices from './cart.services';

const router = express.Router();

// get all cart items
router.get('/', async (request: Request, response: Response) => {
    try {
        const cartItems = await CartItemServices.listCartItems();
        return response.status(200).json(cartItems);
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
});

// get cart items of a user
router.get('/:userId', async (request: Request, response: Response) => {
    const { userId } = request.params;
    try {
        const cartItems = await CartItemServices.listCartItemsByUser(userId);
        return response.status(200).json(cartItems);
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
});

// create a new cart item
router.post('/:userId', createCartItemValidation, async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ message: errors.array()[0].msg });
    }
    
    const { userId } = request.params;
    try {
        const newCartItem = await CartItemServices.createCartItem(userId,request.body);
        return response.status(201).json(newCartItem);
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
});

// update cart item
router.put('/:userId', updateCartItemValidation, async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ message: errors.array()[0].msg });
    }

    const { userId } = request.params;

    try {
        const updatedCartItem = await CartItemServices.updateCartItem(userId, request.body);
        return response.status(200).json(updatedCartItem);
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
});

router.delete('/:userId', deleteCartItemValidation, async (request: Request, response: Response) => {
    const { userId } = request.params;
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ message: errors.array()[0].msg });
    }
    try {
        await CartItemServices.deleteCartItem(userId, request.body.cartItemId);
        return response.status(204).send();
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
});

export default router;
