import express, { type Request, type Response } from 'express';
import { createCartItemSchema, deleteCartItemSchema, updateCartItemSchema } from './cart.schema';
import * as CartItemServices from './cart.services';

const router = express.Router();

// get all cart items
router.get('/get-all-cart-items', async (request: Request, response: Response) => {
    try {
        const cartItems = await CartItemServices.listCartItems();
        if (!cartItems || cartItems.length === 0) {
            return response.status(400).json({ data: null, message: "Cart items not found!" });
        }
        return response.status(200).json({ data: cartItems, message: "Cart items found!" });
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
});

// get cart items of a user
router.get('/get-cart-items-of-a-user/:userId', async (request: Request, response: Response) => {
    const { userId } = request.params;
    try {
        const cartItems = await CartItemServices.listCartItemsByUser(userId);
        return response.status(200).json(cartItems);
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
});

// Create a new cart item
router.post('/create-cart-item-of-a-user/:userId', async (request: Request, response: Response) => {
    const { userId } = request.params;
    const dataToValidate = { ...request.body, userId };
    const validationResult = createCartItemSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0].message;
        return response.status(400).json({ message: errorMessage });
    }

    try {
        const validatedData = validationResult.data;
        const newCartItem = await CartItemServices.createCartItem(validatedData);
        return response.status(201).json(newCartItem);
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
});


// update cart item
router.post('/update-cart-item/:userId', async (request: Request, response: Response) => {
    const { userId } = request.params;
    const validationResult = updateCartItemSchema.safeParse(request.body);

    if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0].message;
        return response.status(400).json({ message: errorMessage });
    }

    try {
        const validatedData = validationResult.data;
        const updatedCartItem = await CartItemServices.updateCartItem(validatedData);
        return response.status(200).json(updatedCartItem);
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
});

router.post('/delete-cart-item/:userId', async (request: Request, response: Response) => {
    const { userId } = request.params;

    const validationResult = deleteCartItemSchema.safeParse(request.body);
    if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0].message;
        return response.status(400).json({ message: errorMessage });
    }

    try {
        await CartItemServices.deleteCartItem(validationResult.data.id);
        return response.status(204).send();
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
});

export default router;
