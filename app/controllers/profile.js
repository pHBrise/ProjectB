const userModel = require("../models/User");
const profileModel = require("../models/Profile");
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const jwt = require("jsonwebtoken");
const joi = require("joi");

module.exports.getProfile = async (req, res) => {
  const playload = req.playload;

  try {
    const userProfile = await profileModel.findOne({ user: playload._id });

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

}

module.exports.updateProfile = upload.single('image'), async (req, res) => {
  const user = req.user;
  try {
    const userProfile = await profileModel.findOne({ user: user._id });

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Get the user profile data
    const updateProfile = req.body;

    // Save the user profile image to GridFS
    const image = await storage.create({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    await image.write(req.file.buffer);

    // Save the user profile to MongoDB
    if (updateProfile.first_name) userProfile.first_name = updateProfile.first_name
    if (updateProfile.last_name) userProfile.last_name = updateProfile.last_name
    if (updateProfile.first_name) userProfile.first_name = updateProfile.first_name
    if (updateProfile.first_name) userProfile.first_name = updateProfile.first_name
    if (updateProfile.first_name) userProfile.first_name = updateProfile.first_name

    // Respond with the user profile
    res.json(userProfile);

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}