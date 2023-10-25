const userModel = require("../models/User");
const profileModel = require("../models/Profile");
const jwt = require("jsonwebtoken");
const joi = require("joi");

module.exports.getProfile = async (req, res) => {
  const user = req.user;

  try {
    const userProfile = await profileModel.findOne({ user: user._id });

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

}

module.exports.updateProfile = async (req, res) => {
  const user = req.user;
  try {
    const userProfile = await profileModel.findOne({ user: user._id });

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    // Get the user profile data
    const updateProfile = req.body;
    // Save the user profile to MongoDB
    if (req.file) {
      userProfile.image = req.file.originalname
    }
    if (updateProfile.first_name) userProfile.first_name = updateProfile.first_name
    if (updateProfile.last_name) userProfile.last_name = updateProfile.last_name
    if (updateProfile.email) userProfile.email = updateProfile.email
    if (updateProfile.mobile_number) userProfile.mobile_number = updateProfile.mobile_number
    if (updateProfile.date_of_birth) userProfile.date_of_birth = updateProfile.date_of_birth
    await userProfile.save()
    // Respond with the user profile
    res.json(userProfile);

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: error.message });
  }
}

