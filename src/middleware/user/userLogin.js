const userModel = require("../../models/User");
const bcrypt = require("bcryptjs");
const { json } = require("express");
const joi = require("joi");
const jwt = require("jsonwebtoken");

const userLoginSchema = joi.object({
  email: joi.string().min(6).required().email(),
  password: joi.string().min(6).required(),
});

module.exports = async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({message:"Incorrect Email"})

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json({message:"Invalid Password"});
  const emailConfirmed = user.emailConfirmed;
  if (!emailConfirmed) return res.status(401).json({message:"Pending Account. Please Verify Your Email!"});
  try {
    const { error } = await userLoginSchema.validateAsync(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    else {
      const token = jwt.sign({ _id: user._id,email:user.email}, process.env.SECRET_TOKEN, {
        expiresIn: "30d",
      });
      res.header("auth-token", token).send(token);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};
