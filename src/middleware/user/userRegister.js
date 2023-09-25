const userModel = require('../../models/User');
const sendConfirmationEmail = require('../confirmationEmail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const joi = require('joi');

const registerSchema = joi.object({
  email:joi.string().min(6).required().email(),
  password:joi.string().min(6).required(),
  token:joi.string()
})

module.exports = async (req, res, next) => {
  const emailExist = await userModel.findOne({ email: req.body.email });
  if (emailExist) {
    res.status(400).send("Email is already exists");
    return;
  }

  //HASHING THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const token = jwt.sign({email:req.body.email}, process.env.SECRET_TOKEN, {
    expiresIn: '1d',
  });
  //ON PROCESS OF ADDING NEW USER
  const newUser = new userModel({
    email: req.body.email,
    password: hashedPassword,
    token: token
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
      sendConfirmationEmail(res.email, res.token);
      
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
