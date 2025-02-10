import express from 'express';
import { categorySchema, createProductSchema, deleteProductSchema, updateProductSchema } from './product.schema';
import * as ProductServices from './product.services'; // Import the product services
import { checkUserExists } from '../utils/middleware';
const router = express.Router();
// get product categories
router.get('/get-categories', async (request, response) => {
    try {
        const categories = await ProductServices.getProductCategories();
        if (!categories || categories.length === 0) {
            return response.status(404).json({ data: null, message: 'No categories found!' });
        }
        return response.status(200).json({ data: categories });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: error.message });
    }
});
// create a new category
router.post('/create-category', async (request, response) => {
    try {
        const validationResult = categorySchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ message: zodErrorElement.message });
        }
        const validatedData = validationResult.data;
        const isCategoryExist = await ProductServices.isCategoryExist(validatedData.name);
        if (isCategoryExist) {
            return response.status(400).json({ data: null, message: 'Category already exists' });
        }
        const category = await ProductServices.createCategory(validatedData);
        return response.status(200).json({ data: category, message: 'Category created successfully' });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: error.message });
    }
});
// get products by categories
router.get('/get-products-by-category/:category', async (request, response) => {
    try {
        const category = request.params.category;
        if (!category) {
            return response.status(404).json({ data: null, message: 'No category' });
        }
        const products = await ProductServices.getProductBaseByCategory(category);
        if (!products || products.length === 0) {
            return response.status(404).json({ data: null, message: 'No products found in this category' });
        }
        return response.status(200).json({ data: products });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: error.message });
    }
});
// // GET: List of all Products
router.get("/get-all-products", async (request, response) => {
    try {
        const products = await ProductServices.listAllProducts();
        if (!products || products.length === 0) {
            return response.status(404).json({ data: null, message: 'No products found!' });
        }
        return response.status(200).json({ data: products, message: "Products found" });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: error.message });
    }
});
// GET: Get a single Product by ID
router.get("/get-product-by-id/:productId", async (request, response) => {
    try {
        const productId = request.params.productId;
        const product = await ProductServices.getProductDetailById(productId);
        if (!product) {
            return response.status(404).json({ data: null, message: 'Product Doesn\'t Exist' });
        }
        return response.status(200).json({ data: product });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
});
// get-product-base-by-id
router.get('/get-product-base-by-id/:productId', async (request, response) => {
    try {
        const productId = request.params.productId;
        const product = await ProductServices.getProductBaseById(productId);
        if (!product) {
            return response.status(404).json({ data: null, message: 'Product Doesn\'t Exist' });
        }
        return response.status(200).json({ data: product });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
});
router.get('/get-latest-products', async (request, response) => {
    try {
        const latestProducts = await ProductServices.getLatestProducts();
        if (!latestProducts || latestProducts.length === 0) {
            return response.status(404).json({ data: null, message: 'No latest products found!' });
        }
        return response.status(201).json({ data: latestProducts, message: 'Fetched Latest Products' });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
});
//  Create a new Product
router.post("/create-new-product", async (request, response) => {
    try {
        const validationResult = createProductSchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ message: zodErrorElement.message });
        }
        const validatedData = validationResult.data;
        console.log("🚀 ~ router.post ~ validatedData:", validatedData);
        const newProduct = await ProductServices.createProduct(validatedData);
        console.log("🚀 ~ router.post ~ newProduct:", newProduct);
        if (!newProduct) {
            return response.status(400).json({ data: null, message: "Product not created" });
        }
        return response.status(201).json({ message: "product created", data: newProduct.id });
    }
    catch (error) {
        console.log("🚀 ~ router.post ~ error:", error);
        return response.status(500).json({ message: error.message });
    }
});
// delete a product from the DB
router.get('/delete-product-by-id/:productId', async (request, response) => {
    try {
        const productId = request.params.productId;
        const validationResult = deleteProductSchema.safeParse({ id: productId });
        if (!validationResult.success) {
            const errorMessage = validationResult.error.errors[0].message;
            return response.status(400).json({ message: errorMessage });
        }
        const isProductExist = await ProductServices.isProductExist(productId);
        if (!isProductExist) {
            return response.status(404).json({ data: null, message: 'Product not found' });
        }
        const isProductDeleted = await ProductServices.deleteProduct(productId);
        if (!isProductDeleted) {
            return response.status(400).json({ data: null, message: 'Product not deleted' });
        }
        return response.status(200).json({ data: isProductDeleted, message: 'Product deleted successfully' });
    }
    catch (error) {
        console.log("🚀 ~ router.get ~ error:", error);
        return response.status(500).json({ data: null, message: 'Internal Server Error!' });
    }
});
// Update a Product by ID
router.post("/update-product-by-id/:productId", async (request, response) => {
    try {
        const productId = request.params.productId;
        const validationResult = updateProductSchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ data: null, message: zodErrorElement.message });
        }
        const isProductExist = await ProductServices.isProductExist(productId);
        if (!isProductExist) {
            return response.status(404).json({ data: null, message: 'Product not found' });
        }
        const updatedProduct = await ProductServices.updateProduct(productId, request.body);
        if (!updatedProduct) {
            return response.status(400).json({ data: null, message: 'Product not updated' });
        }
        return response.status(201).json({ data: updatedProduct, message: 'Product Updated Successfully!' });
    }
    catch (error) {
        console.log("🚀 ~ router.post ~ error:", error);
        return response.status(500).json({ data: null, message: 'Internal Server Error!' });
    }
});
// Add product to favourites
router.post("/add-to-favourite/:productId", checkUserExists, async (request, response) => {
    try {
        const productId = request.params.productId;
        const userId = request.user?.id;
        if (!userId) {
            return response.status(404).json({ data: null, message: 'User not found' });
        }
        const isProductExist = await ProductServices.isProductExist(productId);
        if (!isProductExist) {
            return response.status(404).json({ data: null, message: 'Product not found' });
        }
        const isInFavourite = await ProductServices.isInFavourite(userId, productId);
        if (isInFavourite) {
            return response.status(404).json({ data: null, message: 'Product already in favourites' });
        }
        const favourite = await ProductServices.addToFavourite(userId, productId);
        if (!favourite || favourite === null || favourite === undefined) {
            return response.status(404).json({ data: null, message: 'Product not added to favourites' });
        }
        return response.status(200).json({ data: true, message: 'Product added to favourites successfully!' });
    }
    catch (error) {
        console.log("🚀 ~ router.post ~ error:", error);
        return response.status(500).json({ data: null, message: 'Internal Server Error!' });
    }
});
// // add to favourite
router.get("/get-favourite-products", checkUserExists, async (request, response) => {
    try {
        const userId = request.user?.id;
        if (!userId) {
            return response.status(404).json({ data: null, message: 'User not found' });
        }
        const favouriteProducts = await ProductServices.getFavouriteProducts(userId);
        if (!favouriteProducts || favouriteProducts.length === 0) {
            return response.status(404).json({ data: null, message: 'No favourite products found' });
        }
        return response.status(200).json({ data: favouriteProducts, message: 'Fetched favourite products' });
    }
    catch (error) {
        console.log("🚀 ~ router.get ~ error:", error);
        return response.status(500).json({ data: null, message: 'Internal Server Error!' });
    }
});
// remove from favourite
router.get("/remove-from-favourite/:productId", checkUserExists, async (request, response) => {
    try {
        const productId = request.params.productId;
        const userId = request.user?.id;
        if (!userId) {
            return response.status(404).json({ data: null, message: 'User not found' });
        }
        const isProductExist = await ProductServices.isProductExist(productId);
        if (!isProductExist) {
            return response.status(404).json({ data: null, message: 'Product not found' });
        }
        const isInFavourite = await ProductServices.isInFavourite(userId, productId);
        if (!isInFavourite) {
            return response.status(404).json({ data: null, message: 'Product not in favourites' });
        }
        const favourite = await ProductServices.deleteFavouriteProduct(productId, userId);
        if (!favourite || favourite === null || favourite === undefined) {
            return response.status(404).json({ data: null, message: 'Product not removed from favourites' });
        }
        return response.status(200).json({ data: true, message: 'Product removed from favourites successfully!' });
    }
    catch (error) {
        console.log("🚀 ~ router.delete ~ error:", error);
        return response.status(500).json({ data: null, message: 'Internal Server Error!' });
    }
});
export default router;
