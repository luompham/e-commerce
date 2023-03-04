const User = require('../models/userModel');

const createUser = async (req, res) => {

    const email = req.body.email;

    const findUser = await User.findOne({ email });

    if (!findUser) {

        //create new user
        const newUser = await User.create(req.body);
        res.json(newUser);
        console.log('User has been created successfully!!!');

    } else {

        res.json({
            message: "User already exists",
            success: false
        })
    }


};

module.exports = { createUser };