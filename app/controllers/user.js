const userModel = require("../models/User");
const profileModel = require("../models/Profile");
const confirmationEmail = require("./confirmationEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const joi = require("joi");
const crypto = require("crypto");
const { use } = require("../routers/user");
const { json } = require("express");

const pass_reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

// User Register
const registerSchema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().min(8).pattern(new RegExp(pass_reg)).required(),
    token: joi.string(),
});

module.exports.register = async (req, res) => {
    const emailExist = await profileModel.findOne({ email: req.body.email });
    if (emailExist) {
        res.status(400).json({
            success: false,
            message: "Email is already exists"
        });
        return;
    }

    try {
        const { error } = await registerSchema.validateAsync(req.body);
        if (error) {
            res.status(400).json({
                success: false,
                message: error.details[0].message,
                error: error
            });
            return;
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const token = jwt.sign({ email: req.body.email }, process.env.SECRET_TOKEN, {
                expiresIn: "1d",
            });
            //ON PROCESS OF ADDING NEW USER
            const newUser = new userModel({
                password: hashedPassword,
                secret_login: token,
            });
            const profile = new profileModel({
                user:newUser._id,
                first_name: null,
                last_name: null,
                email: req.body.email,
                mobile_number: null,
                date_of_birth:null,
            })
            await newUser.save();
            await profile.save();
            res.status(200).json({
                success: true,
                message: "Create User Success"
            })
            confirmationEmail.sendConfirmationEmail(
                profile.email,
                newUser.secret_login
            );
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
            error: error
        })
    }
};

//User Login
const userLoginSchema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().min(8).required(),
});

module.exports.login = async (req, res) => {
    const profile = await profileModel.findOne({ email: req.body.email });
    if (!profile) return res.status(400).json({
        success: false,
        message: "Incorrect Email",
        data: null
    })
    const user = await userModel.findOne({_id: profile.user})
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid Password" });
    const emailConfirmed = user.email_confirmed;
    if (!emailConfirmed) return res.status(401).json({ message: "Pending Account. Please Verify Your Email!" });
    try {
        const { error } = await userLoginSchema.validateAsync(req.body);
        if (error) return res.status(400).send({
            success: false,
            message: error.details[0].message,
            error: error
        });
        else {
            const secret_login = crypto.randomBytes(32).toString("hex");
            user.secret_login = secret_login
            await user.save();
            const token = jwt.sign({ _id: user._id, email: user.email, secret_login: user.secret_login }, process.env.SECRET_TOKEN, {
                expiresIn: "1m",
            });
            const asset_token = jwt.sign({ _id: user._id, secret_login: user.secret_login }, process.env.SECRET_TOKEN, {
                expiresIn: "1d",
            });
            res.status(200).send({
                success: true,
                message: 'Login Success',
                data: {
                    user: user,
                    login_token: token,
                    asset_token: asset_token
                },
            });
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};

//User Create New Password

const newPasswordSchema = joi.object({
    password: joi.string().min(6).required(),
    new_password: joi.string().min(8).pattern(new RegExp(pass_reg)).required(),
});

module.exports.setupNewPassword = async (req, res) => {
    const playload = req.playload
    const user = await userModel.findOne({ _id: playload._id, secret_login: playload.secret_login });
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
    } else {
        res.status(401).json({ message: "User not found" });
    }

};