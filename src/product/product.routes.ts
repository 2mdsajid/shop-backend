import express, { Request, Response } from 'express';
import * as ProductServices from './product.services'; // Import the product services
import { body, validationResult } from 'express-validator';
import { commentValidation, productValidation, ratingValidation, reviewValidation, updateProductValidation } from './product.types';


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
router.get("/:productId", async (request: Request, response: Response) => {
  try {
    const productId = request.params.productId;
    const product = await ProductServices.getProductById(productId);

    if (!product) {
      return response.status(404).json({ message: 'Product not found' });
    }

    return response.status(200).json(product);
  } catch (error: any) {
    return response.status(500).json({ message: error.message });
  }
});

// POST: Create a new Product
router.post("/", productValidation, async (request: Request, response: Response) => {
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

// PUT: Update a Product by ID
router.put("/:productId", updateProductValidation, async (request: Request, response: Response) => {
  try {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ message: errors.array()[0].msg });
    }

    const productId = request.params.productId;
    const updatedProduct = await ProductServices.updateProduct(productId, request.body);

    if (!updatedProduct) {
      return response.status(404).json({ message: 'Product not found' });
    }

    return response.status(200).json({
      message: "Product updated successfully",
      updatedProduct
    });
  } catch (error: any) {
    return response.status(500).json({ message: error.message });
  }
});

// POST: Add a Comment to a Product
router.post("/:productId/comments", commentValidation, async (request: Request, response: Response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ message: errors.array()[0].msg });
    }
    const productId = request.params.productId;
    const newComment = await ProductServices.addCommentToProduct(productId, request.body);
    return response.status(201).json({
      message: "commend added successfully",
      newComment
    });
  } catch (error: any) {
    return response.status(500).json({ message: error.message });
  }
});

// POST: Add a Review to a Product
router.post("/:productId/reviews", reviewValidation, async (request: Request, response: Response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ message: errors.array()[0].msg });
    }
    const productId = request.params.productId;
    const newReview = await ProductServices.addReviewToProduct(productId, request.body);
    return response.status(201).json(newReview);
  } catch (error: any) {
    return response.status(500).json({ message: error.message });
  }
});

// POST: Add a Rating to a Product
router.post("/:productId/ratings", ratingValidation, async (request: Request, response: Response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ message: errors.array()[0].msg });
    }
    const productId = request.params.productId;
    const newRating = await ProductServices.addRatingToProduct(productId, request.body);
    return response.status(201).json(newRating);
  } catch (error: any) {
    return response.status(500).json({ message: error.message });
  }
});

export default router;
