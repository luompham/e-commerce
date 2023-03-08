const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongodbId');


//Create a blog
const createBlog = asyncHandler(async (req, res) => {

    try {

        const newBlog = await Blog.create(req.body);
        res.json(newBlog);

    } catch (error) {

        throw new Error(error);
    }
});


//Update a blog

const updateOneBlog = asyncHandler(async (req, res) => {

    const { id } = req.params;
    validateMongoDbId(id);

    try {

        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateBlog);

    } catch (error) {

        throw new Error(error);
    }
});


//Get a blog
const getOneBlog = asyncHandler(async (req, res) => {

    const { id } = req.params;
    validateMongoDbId(id);

    try {

        const getBlog = await Blog.findById(id);
        await Blog.findByIdAndUpdate(id,
            {
                $inc: { numViews: 1 },
            },
            { new: true }
        );

        res.json(getBlog);

    } catch (error) {
        throw new Error(error);

    }

});


//Get all blogs
const getAllBlogs = asyncHandler(async (req, res) => {

    try {

        const getBlogs = await Blog.find();

        res.json(getBlogs);

    } catch (error) {
        throw new Error(error);

    }

});



//Delete a blog

const deleteBlog = asyncHandler(async (req, res) => {

    const { id } = req.params;
    validateMongoDbId(id);

    try {

        const deleteBlog = await Blog.findByIdAndDelete(id);
        res.json(deleteBlog);

    } catch (error) {

        throw new Error(error);
    }
});


//Like blog
const likeBlog = asyncHandler(async (req, res) => {

    const { blogId } = req.body;

    validateMongoDbId(blogId);

    //find the blog which to want to be liked
    const blog = await Blog.findById(blogId);

    //find the login user
    const loginUserId = req?.user?._id;

    //find if the user has liked the blog
    const isLiked = blog?.isLiked;

    //find if the user has disliked the blog
    const alreadyDisliked = blog?.disLikes?.find(
        (userId => userId?.toString() === loginUserId?.toString())
    );
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { disLikes: loginUserId },
                isDisLiked: false,
            },
            { new: true }
        );
        res.json(blog);
    }
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            },
            { new: true }
        );
        res.json(blog);
    } else {

        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { likes: loginUserId },
                isLiked: true,
            },
            { new: true }
        );
        res.json(blog);
    }


});

module.exports = {
    createBlog,
    updateOneBlog,
    getOneBlog,
    getAllBlogs,
    deleteBlog,
    likeBlog
};

