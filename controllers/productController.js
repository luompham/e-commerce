const Product = require('../models/productModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

//Create a product
const createProduct = asyncHandler(async (req, res) => {

    try {

        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        const newProduct = await Product.create(req.body);
        res.json(newProduct);

    } catch (error) {

        throw new Error(error);

    }
    res.json({
        message: 'Hey, this is product post'
    })
});


//Update a product

const updateOneProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        const updateProduct = await Product.findOneAndUpdate({ _id: id }, req.body, {
            new: true
        });

        res.json(updateProduct);

    } catch (error) {
        throw new Error(error);

    }

});


//Delete a product

const deleteOneProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;

    try {


        const deleteProduct = await Product.findOneAndDelete(id);

        res.json(deleteProduct);

    } catch (error) {
        throw new Error(error);

    }

});

//Get a product
const getOneProduct = asyncHandler(async (req, res) => {

    const { id } = req.params;

    try {

        const findProduct = await Product.findById(id);
        res.json({ findProduct });

    } catch (error) {

        throw new Error(error);
    }


});


//Get all products

const getAllProducts = asyncHandler(async (req, res) => {


    try {
        //filtering products
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]);
        console.log(queryObj);

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);


        let query = Product.find(JSON.parse(queryString));

        //Sorting

        if (req.query.sort) {

            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);

        } else {

            query = query.sort('-createdAt');

        }


        //Limiting the fields
        if (req.query.fields) {

            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);

        } else {

            query = query.select('-__v');

        }


        //pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error('This page does not exist');
        }



        const product = await query;
        res.json(product);

    } catch (error) {
        throw new Error(error)
    }

});


//Add to Wishlist
const addToWishList = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {

        const user = await User.findById(_id);
        const alreadyAdded = user.wishlist.find((_id) => _id.toString() === prodId);

        if (alreadyAdded) {

            let user = await User.findByIdAndUpdate(_id,
                {
                    $pull: { wishlist: prodId },
                },
                {
                    new: true,
                }
            );

            res.json(user);

        } else {

            let user = await User.findByIdAndUpdate(_id,
                {
                    $push: { wishlist: prodId },
                },
                {
                    new: true,
                }
            );

            res.json(user);
        }

    } catch (error) {
        throw new Error(error);
    }

});

module.exports = {
    createProduct,
    getOneProduct,
    getAllProducts,
    updateOneProduct,
    deleteOneProduct,
    addToWishList
};
