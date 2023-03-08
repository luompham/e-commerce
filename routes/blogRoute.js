const express = require('express');
const router = express.Router();
const {
    createBlog,
    updateOneBlog,
    getOneBlog,
    getAllBlogs,
    deleteBlog,
    likeBlog,
    disLikeBlog
} = require('../controllers/blogController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');


router.post('/', authMiddleware, isAdmin, createBlog);
router.put('/likes', authMiddleware, likeBlog);
router.put('/dislikes', authMiddleware, disLikeBlog);
router.put('/:id', authMiddleware, isAdmin, updateOneBlog);
router.get('/:id', getOneBlog);
router.get('/', getAllBlogs);
router.delete('/:id', authMiddleware, isAdmin, deleteBlog);


module.exports = router;