const express = require('express');
const router = express.Router();
const {
    createBrand,
    updateBrand,
    deleteBrand,
    getOneBrand,
    getAllBrand
} = require('../controllers/brandController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');


router.post('/', authMiddleware, isAdmin, createBrand);
router.put('/:id', authMiddleware, isAdmin, updateBrand);
router.delete('/:id', authMiddleware, isAdmin, deleteBrand);
router.get('/:id', getOneBrand);
router.get('/', getAllBrand);


module.exports = router;

