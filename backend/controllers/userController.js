const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

/**
 * Add a user to the database
 * @param req request object which should contain the name and password
 * @param res response object will contain the user information along with the token
 */
const registerUser = asyncHandler(async (req, res) => {
    const {name, password} = req.body;
    if (!name || !password){
        res.status(400);
        throw new Error("Please fill out all fields.");
    }

    const userExists = await User.findOne({name})

    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        password: hashedPassword
    })

    if(user){
        res.status(201)
        res.json({
            _id: user.id,
            name: user.name,
            token: generateToken(user._id)
        })
    } else{
        res.status(400)
        throw new Error("Invalid user data");
    }

})

/**
 * Login in the user
 * @param req request object which should contain the name and password
 * @param res response object will contain the user information along with the token
 */
const loginUser = asyncHandler(async (req, res) => {
    const {name, password} = req.body
    const user = await User.findOne({name})
    //id is the string
    //_id is the object
    if( user && (await bcrypt.compare(password, user.password))){
        res.status(201);
        res.json({
            _id: user.id,
            name: user.name,
            token: generateToken(user._id) 
        })
    } else {
        res.status(400)
        throw new Error("Invalid Login Credentials");
    }

})


/**
 * Generate a jwt token based on the user id
 * @param id the id of the user
 * @return a jwt token
 */
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: "30d" });
}





module.exports = { registerUser, loginUser};