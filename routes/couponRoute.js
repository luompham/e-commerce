const express = require('express');
const router = express.Router();
const {
    createCoupon, getAllCoupons, updateCoupon, deleteOneCoupon
} = require('../controllers/couponController');

const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');


router.post('/', authMiddleware, isAdmin, createCoupon);
router.get('/', authMiddleware, isAdmin, getAllCoupons);
router.put('/:id', authMiddleware, isAdmin, updateCoupon);
router.delete('/:id', authMiddleware, isAdmin, deleteOneCoupon);


module.exports = router;
