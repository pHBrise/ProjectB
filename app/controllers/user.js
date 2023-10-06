const userModel = require("../models/User");
const confirmationEmail = require("./confirmationEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const joi = require("joi");
const { use } = require("../routers/user");
const { json } = require("express");

// User Register
const registerSchema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    token: joi.string(),
});

module.exports.register = async (req, res) => {
    const emailExist = await userModel.findOne({ email: req.body.email });
    if (emailExist) {
        res.status(400).send("Email is already exists");
        return;
    }

    //HASHING THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const token = jwt.sign({ email: req.body.email }, process.env.SECRET_TOKEN, {
        expiresIn: "1d",
    });
    //ON PROCESS OF ADDING NEW USER
    const newUser = new userModel({
        email: req.body.email,
        password: hashedPassword,
        confirmationCode: token,
    });

    try {
        //VALIDATION OF USER INPUTS
        const { error } = await registerSchema.validateAsync(req.body);
        //WE CAN JUST GET THE ERROR(IF EXISTS) WITH OBJECT DECONSTRUCTION
        //   IF ERROR EXISTS THEN SEND BACK THE ERROR
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        } else {
            //NEW USER IS ADDED
            const saveUser = await newUser.save();
            res.status(200).send("user created");
            confirmationEmail.sendConfirmationEmail(
                newUser.email,
                newUser.confirmationCode
            );
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

//User Login
const userLoginSchema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().min(8).required(),
});

module.exports.login = async (req, res) => {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "Incorrect Email" })

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid Password" });
    const emailConfirmed = user.emailConfirmed;
    if (!emailConfirmed) return res.status(401).json({ message: "Pending Account. Please Verify Your Email!" });
    try {
        const { error } = await userLoginSchema.validateAsync(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        else {
            const token = jwt.sign({ _id: user._id, email: user.email }, process.env.SECRET_TOKEN, {
                expiresIn: "1m",
            });
            res.header("auth-token", token).send(token);
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};

//User Create New Password

const newPasswordSchema = joi.object({
    password: joi.string().min(6).required(),
    new_password: joi.string().min(8).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

module.exports.setupNewPassword = async (req, res) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).send("Access Denied");
    const {error} = newPasswordSchema.validate(req.body);
    if (error) return res.status(400).json(error);
    jwt.verify(token, process.env.SECRET_TOKEN, async (error, playload) => {
        if (error) return res.status(401).json(error.message)
        if (playload) {
            const user = await userModel.findOne({ _id: playload._id, email: playload.email });
            if (user) {
                const validPassword = await bcrypt.compare(req.body.password, user.password);
                if (validPassword) {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(req.body.new_password, salt);
                    user.password = hashedPassword
                    await user.save();
                    const asset_token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN, {
                        expiresIn: "1d",
                    });
                    const login_token = jwt.sign({ _id: user._id, email: user.email }, process.env.SECRET_TOKEN, {
                        expiresIn: "1m",
                    });
                    res.status(200).json({ login_token: login_token, asset_token: asset_token })
                } else {
                    res.status(401).json({ message: "Old Password not match" });
                }
            }
        }
    })

};