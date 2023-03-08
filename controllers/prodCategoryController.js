const Category = require('../models/prodCategoryModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongodbId');

//Create a new category
const createCategory = asyncHandler(async (req, res) => {

    try {

        const newCategory = await Category.create(req.body);
        res.json(newCategory);

    } catch (error) {
        throw new Error(error);

    }

});


//Update a new category
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {

        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedCategory);

    } catch (error) {
        throw new Error(error);

    }

});


//Delete a new category
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {

        const deletedCategory = await Category.findByIdAndDelete(id);
        res.json(deletedCategory);

    } catch (error) {
        throw new Error(error);

    }

});

//Get a new category
const getOneCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {

        const getOneCategory = await Category.findById(id);
        res.json(getOneCategory);

    } catch (error) {
        throw new Error(error);

    }

});

//Get all new category
const getAllCategory = asyncHandler(async (req, res) => {


    try {

        const getAllCategory = await Category.find();
        res.json(getAllCategory);

    } catch (error) {
        throw new Error(error);

    }

});

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getOneCategory,
    getAllCategory
};