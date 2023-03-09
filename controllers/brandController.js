const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongodbId');

//Create a new Brand
const createBrand = asyncHandler(async (req, res) => {

    try {

        const newBrand = await Brand.create(req.body);
        res.json(newBrand);

    } catch (error) {
        throw new Error(error);

    }

});


//Update a new Brand
const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {

        const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedBrand);

    } catch (error) {
        throw new Error(error);

    }

});


//Delete a new Brand
const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {

        const deletedBrand = await Brand.findByIdAndDelete(id);
        res.json(deletedBrand);

    } catch (error) {
        throw new Error(error);

    }

});

//Get a new Brand
const getOneBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {

        const getOneBrand = await Brand.findById(id);
        res.json(getOneBrand);

    } catch (error) {
        throw new Error(error);

    }

});

//Get all new Brand
const getAllBrand = asyncHandler(async (req, res) => {


    try {

        const getAllBrand = await Brand.find();
        res.json(getAllBrand);

    } catch (error) {
        throw new Error(error);

    }

});

module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getOneBrand,
    getAllBrand
};