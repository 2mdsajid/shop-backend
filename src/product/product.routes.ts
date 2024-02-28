import express, { Request, Response } from 'express';
import * as ProductServices from './product.services'; // Import the product services
import { body, validationResult } from 'express-validator';
import { commentValidation, getTokenItemsValidation, itemsForCheckoutValidation, itemsForPlaceOrderValidation, productValidation, ratingValidation, reviewValidation, updateProductValidation } from './product.types';
import { RequestWithUserId, checkUserExists } from '../utils/middleware';

const router = express.Router();

// GET: List of all Products
router.get("/", async (request: Request, response: Response) => {
  try {
    const products = await ProductServices.listProducts();
    return response.status(200).json(products);
  } catch (error: any) {
    return response.status(500).json({ message: error.message });
  }
});

// GET: Get a single Product by ID
router.get("/get/:productId", async (request: Request, response: Response) => {
  try {
    const productId = request.params.productId;
    const product = await ProductServices.getProductById(productId);
    if (!product) {
      return response.status(404).json({ data: null, message: 'Product Doesn\'t Exist' });
    }
    return response.status(200).json({ data: product });
  } catch (error: any) {
    return response.status(500).json({ data: null, message: 'Internal Server Error' });
  }
});


router.get('/get-latest', async (request: Request, response: Response) => {
  try {
    const latestBags = await ProductServices.getLatestProduct()
    return response.status(201).json({ data: latestBags, message: 'Fetched Latest Products' });
  } catch (error) {
    return response.status(500).json({ data: null, message: 'Internal Server Error' });
  }
})


// // POST: Create a new Product
router.post("/add", checkUserExists, productValidation, async (request: Request, response: Response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ message: errors.array()[0].msg });
    }
    const newProduct = await ProductServices.createProduct(request.body);
    return response.status(201).json({
      message: "product created",
      newProduct
    });
  } catch (error: any) {
    return response.status(500).json({ message: error.message });
  }
});

// generate checkout token and send to FE 
router.post('/generate-checkout-token', itemsForCheckoutValidation, async (request: Request, response: Response) => {
  try {
    const errors = validationResult(request.body);
    if (!errors.isEmpty()) {
      return response.status(400).json({ data: null, message: errors.array()[0].msg });
    }

    const checkoutToken = ProductServices.generateCheckoutToken(request.body)
    return response.status(201).json({ data: checkoutToken, message: 'Fetched Latest Products' });
  } catch (error) {
    return response.status(500).json({ data: null, message: 'Internal Server Error' });
  }
})

// generate place-order-token and send to FE 
router.post('/generate-place-order-token', itemsForPlaceOrderValidation, async (request: Request, response: Response) => {
  try {
    const errors = validationResult(request.body);
    if (!errors.isEmpty()) {
      return response.status(400).json({ data: null, message: errors.array()[0].msg });
    }

    const checkoutToken = ProductServices.generatePlaceOrderToken(request.body)
    return response.status(201).json({ data: checkoutToken, message: 'Token generated' });
  } catch (error) {
    return response.status(500).json({ data: null, message: 'Internal Server Error' });
  }
})

// get checkout token items details from based on tokens from frontend 
router.post('/get-checkout-token-items', getTokenItemsValidation, async (request: Request, response: Response) => {
  try {
    const errors = validationResult(request.body);
    if (!errors.isEmpty()) {
      return response.status(400).json({ data: null, message: errors.array()[0].msg });
    }
    const checkoutTokenItems = ProductServices.decodeCheckoutToken(request.body.token)
    const products = await Promise.all(
      checkoutTokenItems.map(async (product) => {
        const productDetails = await ProductServices.getProductById(product.id);
        return {
          details: productDetails,
          quantity: product.quantity,
        };
      })
    );
    return response.status(201).json({ data: products });
  } catch (error) {
    return response.status(500).json({ data: null, message: 'Internal Server Error' });
  }
})

// get checkout token items details from based on tokens from frontend 
router.post('/get-place-order-token-items', getTokenItemsValidation, async (request: Request, response: Response) => {
  try {
    const errors = validationResult(request.body);
    if (!errors.isEmpty()) {
      return response.status(400).json({ data: null, message: errors.array()[0].msg });
    }
    const checkoutTokenItems = ProductServices.decodePlaceOrderToken(request.body.token)
    const products = await Promise.all(
      checkoutTokenItems.map(async (product) => {
        const productDetails = await ProductServices.getProductById(product.id);
        return {
          details: productDetails,
          price: product.price,
          quantity: product.quantity,
        };
      })
    );
    return response.status(201).json({ data: products });
  } catch (error) {
    return response.status(500).json({ data: null, message: 'Internal Server Error' });
  }
})

// confirm the order items token and then store them and returns the product details
router.post('/confirm-and-get-place-order-items', getTokenItemsValidation, checkUserExists, async (request: RequestWithUserId, response: Response) => {
  try {
    const errors = validationResult(request.body);
    if (!errors.isEmpty()) {
      return response.status(400).json({ data: null, message: errors.array()[0].msg });
    }

    // fetch the order info from db by saving the order details
    const userId = request.userId as string;
    const orderInfo = await ProductServices.storeOrderTokenToDatabase(request.body.token, userId)

    // fetch the order details from db
    const checkoutTokenItems = ProductServices.decodePlaceOrderToken(request.body.token)
    const products = await Promise.all(
      checkoutTokenItems.map(async (product) => {
        const productDetails = await ProductServices.getProductById(product.id);
        return {
          name: productDetails?.name,
          imageUrl: productDetails?.imageUrl,
          category: productDetails?.category,
          price: product.price,
          quantity: product.quantity,
        };
      })
    );
    return response.status(201).json({ data: { products, orderInfo } });
  } catch (error) {
    return response.status(500).json({ data: null, message: 'Internal Server Error' });
  }
})

export default router;
