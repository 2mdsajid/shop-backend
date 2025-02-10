import express from 'express';
import { createShippingAddressSchema } from './shipping.schema';
import { checkUserExists } from '../utils/middleware';
import * as ShippingServices from './shipping.services';
const router = express.Router();
router.post('/create-shipping-address', checkUserExists, async (request, response) => {
    try {
        const validationResult = createShippingAddressSchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ data: null, message: zodErrorElement.message });
        }
        // check if user is null
        const userId = request.user?.id;
        console.log(userId);
        if (!userId) {
            return response.status(404).json({ data: null, message: 'User not found' });
        }
        const validatedData = validationResult.data;
        const newShippingAddress = await ShippingServices.createShippingAddress(validatedData, userId);
        if (!newShippingAddress) {
            return response.status(400).json({ data: null, message: 'Shipping address not created' });
        }
        return response.status(200).json({ data: newShippingAddress, message: 'Shipping address created' });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
});
router.get('/get-shipping-address', checkUserExists, async (request, response) => {
    try {
        const userId = request.user?.id;
        if (!userId) {
            return response.status(404).json({ data: null, message: 'User not found' });
        }
        const shippingAddress = await ShippingServices.getShippingAddress(userId);
        if (!shippingAddress || shippingAddress.length === 0) {
            return response.status(404).json({ data: null, message: 'Shipping address not found' });
        }
        return response.status(200).json({ data: shippingAddress, message: 'Shipping address found' });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
});
export default router;
