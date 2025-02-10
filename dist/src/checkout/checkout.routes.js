import express from 'express';
import { getProductDetailById } from '../product/product.services';
import { checkoutTokenRequestSchema } from './checkout.schema';
import * as CheckoutServices from './checkout.services'; // Import the product services
const router = express.Router();
// generate checkout token and send to FE 
router.post('/generate-checkout-token', async (request, response) => {
    try {
        const validationResult = checkoutTokenRequestSchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ data: null, message: zodErrorElement.message });
        }
        // Check if all products exist
        const productsExist = await Promise.all(request.body.map(async (item) => {
            const product = await getProductDetailById(item.productId);
            return product !== null;
        }));
        if (productsExist.includes(false)) {
            return response.status(400).json({ data: null, message: 'One or more products not found' });
        }
        const checkoutToken = await CheckoutServices.generateCheckoutToken(request.body);
        if (!checkoutToken) {
            return response.status(400).json({ data: null, message: 'Token generation failed' });
        }
        return response.status(201).json({ data: checkoutToken, message: 'Checkout Token Generated' });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
});
// get checkout token items details from based on tokens from frontend 
router.get('/get-checkout-token-items-details/:token', async (request, response) => {
    try {
        const checkoutToken = request.params.token;
        if (!checkoutToken) {
            return response.status(400).json({ data: null, message: 'No checkout token provided' });
        }
        const checkoutTokenItems = await CheckoutServices.decodeCheckoutToken(checkoutToken);
        if (!checkoutTokenItems || checkoutTokenItems.length === 0) {
            return response.status(400).json({ data: null, message: 'No checkout token items found' });
        }
        return response.status(201).json({ data: checkoutTokenItems, message: 'Checkout Token Items Details Fetched' });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
});
//   // generate place-order-token and send to FE 
//   router.post('/generate-place-order-token', async (request: Request, response: Response) => {
//     try {
//       const errors = validationResult(request.body);
//       if (!errors.isEmpty()) {
//         return response.status(400).json({ data: null, message: errors.array()[0].msg });
//       }
//       const checkoutToken = ProductServices.generatePlaceOrderToken(request.body)
//       return response.status(201).json({ data: checkoutToken, message: 'Token generated' });
//     } catch (error) {
//       return response.status(500).json({ data: null, message: 'Internal Server Error' });
//     }
//   })
//   // probably not used
//   // get place-order token items details from tokens from frontend 
//   router.post('/get-place-order-token-items', getTokenItemsValidation, async (request: Request, response: Response) => {
//     try {
//       const errors = validationResult(request.body);
//       if (!errors.isEmpty()) {
//         return response.status(400).json({ data: null, message: errors.array()[0].msg });
//       }
//       const checkoutTokenItems = ProductServices.decodePlaceOrderToken(request.body.token)
//       const products = await Promise.all(
//         checkoutTokenItems.map(async (product) => {
//           const productDetails = await ProductServices.getProductById(product.id);
//           return {
//             details: productDetails,
//             price: product.price,
//             quantity: product.quantity,
//           };
//         })
//       );
//       return response.status(201).json({ data: products });
//     } catch (error) {
//       return response.status(500).json({ data: null, message: 'Internal Server Error' });
//     }
//   })
//   // confirm the order items token and then store them and returns the product details
//   router.post('/confirm-and-get-place-order-items', getTokenItemsValidation, checkUserExists, async (request: RequestWithUserId, response: Response) => {
//     try {
//       const errors = validationResult(request.body);
//       if (!errors.isEmpty()) {
//         return response.status(400).json({ data: null, message: errors.array()[0].msg });
//       }
//       // fetch the order info from db by saving the order details
//       const userId = request.userId as string;
//       const orderInfo = await ProductServices.storeOrderTokenToDatabase(request.body.token, userId)
//       // save order items to db
//       // fetch the order details from db
//       const checkoutTokenItems = ProductServices.decodePlaceOrderToken(request.body.token)
//       await ProductServices.storeOrderItems(checkoutTokenItems, orderInfo.id)
//       const products = await Promise.all(
//         checkoutTokenItems.map(async (product) => {
//           const productDetails = await ProductServices.getProductById(product.id);
//           return {
//             name: productDetails?.name,
//             imageUrl: productDetails?.imageUrl,
//             category: productDetails?.category,
//             price: product.price,
//             quantity: product.quantity,
//           };
//         })
//       );
//       return response.status(201).json({ data: { products, orderInfo } });
//     } catch (error) {
//       return response.status(500).json({ data: null, message: 'Internal Server Error' });
//     }
//   })
export default router;
