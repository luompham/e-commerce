const Product = require('../models/productModel');
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
    const id = req.params;

    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        const updateProduct = await Product.findOneAndUpdate({ id }, req.body, {
            new: true
        });

        res.json(updateProduct);

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

        const findAllProducts = await Product.find();
        res.json({ findAllProducts });

    } catch (error) {
        throw new Error(error)
    }

});

module.exports = {
    createProduct,
    getOneProduct,
    getAllProducts,
    updateOneProduct,
};
