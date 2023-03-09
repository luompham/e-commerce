const express = require('express');
const router = express.Router();
const {
    createBlog,
    updateOneBlog,
    getOneBlog,
    getAllBlogs,
    deleteBlog,
    likeBlog,
    disLikeBlog,
    uploadImages
} = require('../controllers/blogController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { uploadPhoto, blogImgResize } = require('../middlewares/uploadImages');



router.post('/', authMiddleware, isAdmin, createBlog);

router.put(
    '/upload/:id',
    authMiddleware,
    isAdmin,
    uploadPhoto.array('images', 2),
    blogImgResize,
    uploadImages
);

router.put('/likes', authMiddleware, likeBlog);
router.put('/dislikes', authMiddleware, disLikeBlog);
router.put('/:id', authMiddleware, isAdmin, updateOneBlog);
router.get('/:id', getOneBlog);
router.get('/', getAllBlogs);
router.delete('/:id', authMiddleware, isAdmin, deleteBlog);


module.exports = router;