const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const Joi = require('joi');
const authToken = require("../middleware/authToken");
const app = express();
const router = express.Router();

const registerSchema = Joi.object({
    fname:Joi.string().min(3).required(),
    lname:Joi.string().min(3).required(),
    email:Joi.string().min(6).required().email(),
    password:Joi.string().min(6).required(),
})

router.get("/profile",authToken, (req, res) => {
  res.json({message: "My Profile"});
})

router.post('/register', async(req, res) => {
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        res.status.send("Email is already exists");
        return;
    }

      //HASHING THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //ON PROCESS OF ADDING NEW USER

  const user = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: hashedPassword,
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

      const saveUser = await user.save();
      res.status(200).send("user created");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

const userLoginSchema = Joi.object({
  email:Joi.string().min(6).required().email(),
  password:Joi.string().min(6).required(),
}
)

router.post("/login",async(req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Incorrect Email");
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Password");
  try {
    const{error} = await userLoginSchema.validateAsync(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    else {
      const token = jwt.sign({_id:user._id}, process.env.SECRET_TOKEN,{expiresIn: "30d"});
      res.header("auth-token",token).send(token);
    }
  } catch(error) {
    return res.status(500).send(error);
  }

})

module.exports = router;