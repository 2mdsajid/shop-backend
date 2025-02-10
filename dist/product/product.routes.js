"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_schema_1 = require("./product.schema");
const ProductServices = __importStar(require("./product.services")); // Import the product services
const middleware_1 = require("../utils/middleware");
const router = express_1.default.Router();
// get product categories
router.get('/get-categories', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield ProductServices.getProductCategories();
        if (!categories || categories.length === 0) {
            return response.status(404).json({ data: null, message: 'No categories found!' });
        }
        return response.status(200).json({ data: categories });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: error.message });
    }
}));
// create a new category
router.post('/create-category', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = product_schema_1.categorySchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ message: zodErrorElement.message });
        }
        const validatedData = validationResult.data;
        const isCategoryExist = yield ProductServices.isCategoryExist(validatedData.name);
        if (isCategoryExist) {
            return response.status(400).json({ data: null, message: 'Category already exists' });
        }
        const category = yield ProductServices.createCategory(validatedData);
        return response.status(200).json({ data: category, message: 'Category created successfully' });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: error.message });
    }
}));
// get products by categories
router.get('/get-products-by-category/:category', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = request.params.category;
        if (!category) {
            return response.status(404).json({ data: null, message: 'No category' });
        }
        const products = yield ProductServices.getProductBaseByCategory(category);
        if (!products || products.length === 0) {
            return response.status(404).json({ data: null, message: 'No products found in this category' });
        }
        return response.status(200).json({ data: products });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: error.message });
    }
}));
// // GET: List of all Products
router.get("/get-all-products", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield ProductServices.listAllProducts();
        if (!products || products.length === 0) {
            return response.status(404).json({ data: null, message: 'No products found!' });
        }
        return response.status(200).json({ data: products, message: "Products found" });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: error.message });
    }
}));
// GET: Get a single Product by ID
router.get("/get-product-by-id/:productId", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = request.params.productId;
        const product = yield ProductServices.getProductDetailById(productId);
        if (!product) {
            return response.status(404).json({ data: null, message: 'Product Doesn\'t Exist' });
        }
        return response.status(200).json({ data: product });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
}));
// get-product-base-by-id
router.get('/get-product-base-by-id/:productId', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = request.params.productId;
        const product = yield ProductServices.getProductBaseById(productId);
        if (!product) {
            return response.status(404).json({ data: null, message: 'Product Doesn\'t Exist' });
        }
        return response.status(200).json({ data: product });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
}));
router.get('/get-latest-products', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const latestProducts = yield ProductServices.getLatestProducts();
        if (!latestProducts || latestProducts.length === 0) {
            return response.status(404).json({ data: null, message: 'No latest products found!' });
        }
        return response.status(201).json({ data: latestProducts, message: 'Fetched Latest Products' });
    }
    catch (error) {
        return response.status(500).json({ data: null, message: 'Internal Server Error' });
    }
}));
//  Create a new Product
router.post("/create-new-product", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = product_schema_1.createProductSchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ message: zodErrorElement.message });
        }
        const validatedData = validationResult.data;
        console.log("🚀 ~ router.post ~ validatedData:", validatedData);
        const newProduct = yield ProductServices.createProduct(validatedData);
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
}));
// delete a product from the DB
router.get('/delete-product-by-id/:productId', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = request.params.productId;
        const validationResult = product_schema_1.deleteProductSchema.safeParse({ id: productId });
        if (!validationResult.success) {
            const errorMessage = validationResult.error.errors[0].message;
            return response.status(400).json({ message: errorMessage });
        }
        const isProductExist = yield ProductServices.isProductExist(productId);
        if (!isProductExist) {
            return response.status(404).json({ data: null, message: 'Product not found' });
        }
        const isProductDeleted = yield ProductServices.deleteProduct(productId);
        if (!isProductDeleted) {
            return response.status(400).json({ data: null, message: 'Product not deleted' });
        }
        return response.status(200).json({ data: isProductDeleted, message: 'Product deleted successfully' });
    }
    catch (error) {
        console.log("🚀 ~ router.get ~ error:", error);
        return response.status(500).json({ data: null, message: 'Internal Server Error!' });
    }
}));
// Update a Product by ID
router.post("/update-product-by-id/:productId", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = request.params.productId;
        const validationResult = product_schema_1.updateProductSchema.safeParse(request.body);
        if (!validationResult.success) {
            const zodErrorElement = JSON.parse(validationResult.error.message)[0];
            return response.status(400).json({ data: null, message: zodErrorElement.message });
        }
        const isProductExist = yield ProductServices.isProductExist(productId);
        if (!isProductExist) {
            return response.status(404).json({ data: null, message: 'Product not found' });
        }
        const updatedProduct = yield ProductServices.updateProduct(productId, request.body);
        if (!updatedProduct) {
            return response.status(400).json({ data: null, message: 'Product not updated' });
        }
        return response.status(201).json({ data: updatedProduct, message: 'Product Updated Successfully!' });
    }
    catch (error) {
        console.log("🚀 ~ router.post ~ error:", error);
        return response.status(500).json({ data: null, message: 'Internal Server Error!' });
    }
}));
// Add product to favourites
router.post("/add-to-favourite/:productId", middleware_1.checkUserExists, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const productId = request.params.productId;
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return response.status(404).json({ data: null, message: 'User not found' });
        }
        const isProductExist = yield ProductServices.isProductExist(productId);
        if (!isProductExist) {
            return response.status(404).json({ data: null, message: 'Product not found' });
        }
        const isInFavourite = yield ProductServices.isInFavourite(userId, productId);
        if (isInFavourite) {
            return response.status(404).json({ data: null, message: 'Product already in favourites' });
        }
        const favourite = yield ProductServices.addToFavourite(userId, productId);
        if (!favourite || favourite === null || favourite === undefined) {
            return response.status(404).json({ data: null, message: 'Product not added to favourites' });
        }
        return response.status(200).json({ data: true, message: 'Product added to favourites successfully!' });
    }
    catch (error) {
        console.log("🚀 ~ router.post ~ error:", error);
        return response.status(500).json({ data: null, message: 'Internal Server Error!' });
    }
}));
// // add to favourite
router.get("/get-favourite-products", middleware_1.checkUserExists, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return response.status(404).json({ data: null, message: 'User not found' });
        }
        const favouriteProducts = yield ProductServices.getFavouriteProducts(userId);
        if (!favouriteProducts || favouriteProducts.length === 0) {
            return response.status(404).json({ data: null, message: 'No favourite products found' });
        }
        return response.status(200).json({ data: favouriteProducts, message: 'Fetched favourite products' });
    }
    catch (error) {
        console.log("🚀 ~ router.get ~ error:", error);
        return response.status(500).json({ data: null, message: 'Internal Server Error!' });
    }
}));
// remove from favourite
router.get("/remove-from-favourite/:productId", middleware_1.checkUserExists, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const productId = request.params.productId;
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return response.status(404).json({ data: null, message: 'User not found' });
        }
        const isProductExist = yield ProductServices.isProductExist(productId);
        if (!isProductExist) {
            return response.status(404).json({ data: null, message: 'Product not found' });
        }
        const isInFavourite = yield ProductServices.isInFavourite(userId, productId);
        if (!isInFavourite) {
            return response.status(404).json({ data: null, message: 'Product not in favourites' });
        }
        const favourite = yield ProductServices.deleteFavouriteProduct(productId, userId);
        if (!favourite || favourite === null || favourite === undefined) {
            return response.status(404).json({ data: null, message: 'Product not removed from favourites' });
        }
        return response.status(200).json({ data: true, message: 'Product removed from favourites successfully!' });
    }
    catch (error) {
        console.log("🚀 ~ router.delete ~ error:", error);
        return response.status(500).json({ data: null, message: 'Internal Server Error!' });
    }
}));
exports.default = router;
