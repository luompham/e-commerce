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
    resetPassword
} = require('../controllers/userController');

const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/register', createUser);
router.put('/password', authMiddleware, updatePassword);
router.post('/login', loginUserCtrl);
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);
router.get('/all-users', getAllUsers);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.get('/:id', authMiddleware, isAdmin, getOneUser);
router.delete('/:id', deleteOneUser);
router.put('/edit-user', authMiddleware, updateOneUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

module.exports = router;
