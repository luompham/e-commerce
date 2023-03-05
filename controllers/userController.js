const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
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
            return res.status(204);//forbidden
        }
        await User.findOneAndUpdate(refreshToken, {
            refreshToken: '',

        });



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
    logout
};