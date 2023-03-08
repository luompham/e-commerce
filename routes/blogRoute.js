const express = require('express');
const router = express.Router();
const {
    createBlog,
    updateOneBlog,
    getOneBlog,
    getAllBlogs,
    deleteBlog,
    likeBlog
} = require('../controllers/blogController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');


router.put('/likes', authMiddleware, likeBlog);
router.post('/', authMiddleware, isAdmin, createBlog);
router.put('/:id', authMiddleware, isAdmin, updateOneBlog);
router.get('/:id', getOneBlog);
router.get('/', getAllBlogs);
router.delete('/:id', authMiddleware, isAdmin, deleteBlog);


module.exports = router;