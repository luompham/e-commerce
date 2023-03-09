const express = require('express');
const {
    createProduct,
    getOneProduct,
    getAllProducts,
    updateOneProduct,
    deleteOneProduct,
    addToWishList,
    rating,
} = require('../controllers/productController');

const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();




router.post('/', authMiddleware, isAdmin, createProduct);
router.get('/:id', getOneProduct);
router.put('/wishlist', authMiddleware, addToWishList);
router.put('/rating', authMiddleware, rating);
router.put('/:id', authMiddleware, isAdmin, updateOneProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteOneProduct);
router.get('/', getAllProducts);


module.exports = router;
