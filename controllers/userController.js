const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../controllers/emailController');
const { generateToken } = require('../config/jwtToken');
const { validateMongoDbId } = require('../utils/validateMongodbId');
const { generateRefreshToken } = require('../config/refreshToken');


//create new user
const createUser = asyncHandler(async (req, res) => {

    const email = req.body.email;

    const findUser = await User.findOne({ email });

    if (!findUser) {

        //create new user
        const newUser = await User.create(req.body);
        res.json(newUser);
        console.log('User has been created successfully!!!');

    } else {

        throw new Error('User already exists');

        // res.json({
        //     message: "User already exists",
        //     success: false
        // })
    }


});


//Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {

        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken: refreshToken
            },
            { new: true }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });

        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        });
    } else {
        throw new Error('Invalid Credentials');
    }

});


// Admin login
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //check if user exists or not
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== 'admin') throw new Error('Not Authorised');
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {

        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const updateUser = await User.findByIdAndUpdate(
            findAdmin.id,
            {
                refreshToken: refreshToken
            },
            { new: true }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });

        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id)
        });
    } else {
        throw new Error('Invalid Credentials');
    }

});


// Save User Address
const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                address: req?.body?.address,
            },
            { new: true }
        );

        res.json(updatedUser);

    } catch (error) {
        throw new Error(error);
    }

});


//Get all users
const getAllUsers = asyncHandler(async (req, res) => {

    try {

        const getUsers = await User.find();
        res.json(getUsers);

    } catch (error) {

        throw new Error(error.message);

    }

});

//Get a single user

const getOneUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    validateMongoDbId(id);


    try {

        const getUser = await User.findById(id);
        res.json(getUser);

    } catch (error) {
        throw new Error(error.message);


    };

});

//Delete a single user
const deleteOneUser = asyncHandler(async (req, res) => {

    const { id } = req.params;
    validateMongoDbId(id);
    try {

        const deleteUser = await User.findByIdAndDelete(id);
        res.json(deleteUser);

    } catch (error) {
        throw new Error(error.message);

    };

});


//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;

    if (!cookie?.refreshToken) {
        throw new Error('No refresh token in cookies');
    } else {
        const refreshToken = cookie.refreshToken;
        //  console.log(refreshToken);
        const user = await User.findOne({ refreshToken });
        if (!user) {
            throw new Error('No refresh token present in db or not matched');
        } else {
            jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
                if (err || user.id !== decoded.id) {
                    throw new Error('There is something wrong with the refresh token');
                }
                const accessToken = generateToken(user?._id);
                res.json({ accessToken });
            });
        }

    }

});

//Logout functionality

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;

    if (!cookie?.refreshToken) {
        throw new Error('No refresh token in cookies');
    } else {
        const refreshToken = cookie.refreshToken;
        //  console.log(refreshToken);
        const user = await User.findOne({ refreshToken });
        if (!user) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
            });
            res.sendStatus(204);//forbidden

        }
        await User.findOneAndUpdate(refreshToken, {
            refreshToken: '',

        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });

        res.sendStatus(204);//forbidden

    }
});

//Update a single user

const updateOneUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile,

            },
            {
                new: true,
            }
        );
        res.json(updatedUser);

    } catch (error) {
        throw new Error(error.message);


    };

});


//block user 

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {

        const blockUser = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        );
        res.json(blockUser);
    } catch (error) {
        throw new Error(error);
    }


});

//unblock user 

const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {

        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },
            {
                new: true,
            }
        );
        res.json({
            message: 'User unblocked',
        });
    } catch (error) {
        throw new Error(error);
    }
});


//update password

const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    // const password = req.body.password;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
        console.log('password updated successfully');
    } else {
        res.json(user);
        console.log('password updated failed');

    }

});


//Forgot password

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw new Error('User not found with this email');

    try {

        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, please follow this link to reset Your Password. 
        This link is valid till 10 minutes from now.
         <a href='http://localhost:5000/api/user/reset-password/${token}'>Click here</>`

        const data = {
            to: email,
            text: 'Hey User',
            subject: 'Forgot Password Link',
            htm: resetURL,
        };
        sendEmail(data);
        res.json(token);

    } catch (error) {
        throw new Error(error);
    }

});

//reset password

const resetPassword = asyncHandler(async (req, res) => {

    const { password } = req.body;
    const { token } = req.params;
    const hastedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hastedToken,
        passwordResetExpires: { $gt: Date.now() }
    })

    if (!user) throw new Error('Token expired, please try again later.');

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    res.json(user);


});


//Get wishlist
const getWishlist = asyncHandler(async (req, res) => {

    const { _id } = req.user;
    try {

        const findUser = await User.findById(_id).populate('wishlist');
        res.json(findUser)

    } catch (error) {

        throw new Error(error);

    }

});


//Add products to Cart
const userCart = asyncHandler(async (req, res) => {

    const { cart } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        let products = [];
        const user = await User.findById(_id);
        //check if user already have product in cart
        const alreadyExistCart = await Cart.findOne({ orderBy: user._id });

        // if (alreadyExistCart) {
        //     console.log('alreadyExistCart instanceof Cart:', alreadyExistCart instanceof Cart)
        //     await alreadyExistCart.remove();
        // } kiểm tra lại, có thể gỡ id của người dùng khỏi orderBy của alreadyExistCart document

        for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select('price').exec();
            object.price = getPrice.price;
            products.push(object);

        };

        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count;

        };


        let newCart = await new Cart({
            products,
            cartTotal,
            orderBy: user?._id,
        }).save();

        res.json(newCart);

    } catch (error) {

        throw new Error(error);
    }

});

//Get usercart
const getUsercart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);


    try {

        const cart = await Cart.findOne({ orderBy: _id }).populate('products.product');
        res.json(cart);

    } catch (error) {
        throw new Error(error);
    }


});

//Empty cart
const emptyCart = asyncHandler(async (req, res) => {

    const { _id } = req.user;
    validateMongoDbId(_id);


    try {

        const user = await User.findOne({ _id });
        const cart = await Cart.findOneAndRemove({ orderBy: user._id })
        res.json(cart);

    } catch (error) {
        throw new Error(error);
    }

});


//Apply Coupon
const applyCoupon = asyncHandler(async (req, res) => {

    const { coupon } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    const validCoupon = await Coupon.findOne({ name: coupon });

    console.log(validCoupon);

    if (validCoupon === null) {
        throw new Error('Invalid Coupon');
    };

    const user = await User.findOne({ _id });

    let { products, cartTotal } = await Cart.findOne({
        orderBy: user._id
    }).populate('products.product');

    console.log({ products })

    let totalAfterDiscount = (
        cartTotal -
        (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);

    await Cart.findOneAndUpdate(
        { orderBy: user._id },
        { totalAfterDiscount },
        { new: true }
    );

    res.json(totalAfterDiscount);


});

module.exports = {
    createUser,
    loginUserCtrl,
    getAllUsers,
    getOneUser,
    deleteOneUser,
    updateOneUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishlist,
    saveAddress,
    userCart,
    getUsercart,
    emptyCart,
    applyCoupon
};