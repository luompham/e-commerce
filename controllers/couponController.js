const Coupon = require('../models/couponModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongodbId');


//Create coupon
const createCoupon = asyncHandler(async (req, res) => {

    try {

        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);

    } catch (error) {
        throw new Error(error);
    }

});

//Get all coupons
const getAllCoupons = asyncHandler(async (req, res) => {

    try {

        const coupons = await Coupon.find();
        res.json(coupons);

    } catch (error) {
        throw new Error(error);
    }

});

//Update coupon
const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {

        const updateCoupon = await Coupon.findByIdAndUpdate(id,
            req.body,
            {
                new: true
            }
        );

        res.json(updateCoupon);

    } catch (error) {
        throw new Error(error);
    }

});

//Delete a coupon
const deleteOneCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {

        const deleteCoupon = await Coupon.findByIdAndDelete(id);

        res.json(deleteCoupon);

    } catch (error) {
        throw new Error(error);
    }

});

module.exports = { createCoupon, getAllCoupons, updateCoupon, deleteOneCoupon };