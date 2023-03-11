const express = require('express');
const {
    createUser,
    loginUserCtrl,
    getAllUsers,
    getOneUser,
    deleteOneUser,
    updateOneUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishlist,
    saveAddress,
    userCart,
    getUsercart,
    emptyCart,
    applyCoupon
} = require('../controllers/userController');

const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/register', createUser);
router.put('/password', authMiddleware, updatePassword);
router.post('/login', loginUserCtrl);
router.post('/admin-login', loginAdmin);
router.post('/cart', authMiddleware, userCart);
router.post('/forgot-password-token', forgotPasswordToken);
router.post('/cart/applycoupon', authMiddleware, applyCoupon);
router.put('/reset-password/:token', resetPassword);

router.get('/all-users', getAllUsers);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.get('/wishlist', authMiddleware, getWishlist);
router.get('/cart', authMiddleware, getUsercart);

router.get('/:id', authMiddleware, isAdmin, getOneUser);
router.delete('/empty-cart', authMiddleware, emptyCart);
router.delete('/:id', deleteOneUser);

router.put('/edit-user', authMiddleware, updateOneUser);
router.put('/save-address', authMiddleware, saveAddress);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

module.exports = router;
