const userModel = require("../models/User");
const profileModel = require("../models/Profile");
const jwt = require("jsonwebtoken");
const joi = require("joi");

module.exports.getProfile = async(req, res) => {
    const userId = req.userId;

  try {
    const userProfile = await profileModel.findOne({ user: userId });

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  } 

}

module.exports.updateProfile = async(req, res) => {

}