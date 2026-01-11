import express from 'express';
import {
        getAllProducts,
        getFeaturedProducts,
        createProduct,
        deleteProduct,
        getRecommendedProducts,
        getProductsByCategory,
        toggleFeaturedProduct,
        searchProducts,
        getProductById,
        updateProduct
    } from '../controllers/product.controller.js';
import { adminRoute,protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/",protectRoute,adminRoute,getAllProducts)
router.get("/featured",getFeaturedProducts)
router.get("/recommendations",getRecommendedProducts)
router.get("/category/:category",getProductsByCategory)
router.get("/search",searchProducts)
router.get("/:id",getProductById)
router.post("/",protectRoute,adminRoute,createProduct) 
router.patch("/:id",protectRoute,adminRoute,toggleFeaturedProduct);
router.put("/:id", protectRoute, adminRoute, updateProduct);
// put update tất cả patch update 1 vài trường 
router.delete("/:id",protectRoute,adminRoute,deleteProduct) 



export default router 