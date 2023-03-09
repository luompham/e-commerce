const express = require('express');
const router = express.Router();
const {
    createCategory,
    updateCategory,
    deleteCategory,
    getOneCategory,
    getAllCategory
} = require('../controllers/blogCatController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');


router.post('/', authMiddleware, isAdmin, createCategory);
router.put('/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);
router.get('/:id', getOneCategory);
router.get('/', getAllCategory);


module.exports = router;

