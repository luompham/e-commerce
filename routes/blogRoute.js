const express = require('express');
const router = express.Router();
const { createBlog, updateOneBlog } = require('../controllers/blogController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');



router.post('/', authMiddleware, isAdmin, createBlog);
router.put('/:id', authMiddleware, isAdmin, updateOneBlog);


module.exports = router;