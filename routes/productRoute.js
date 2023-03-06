const express = require('express');
const {
    createProduct,
    getOneProduct,
    getAllProducts,
    updateOneProduct,
} = require('../controllers/productController');
const router = express.Router();


router.post('/', createProduct);
router.get('/:id', getOneProduct);
router.put('/:id', updateOneProduct);
router.get('/', getAllProducts);


module.exports = router