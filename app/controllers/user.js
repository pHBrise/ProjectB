const userModel = require("../models/User");
const confirmationEmail = require("./confirmationEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const joi = require("joi");

// User Register
const registerSchema = joi.object({
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
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
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
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
                expiresIn: "30d",
            });
            res.header("auth-token", token).send(token);
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};