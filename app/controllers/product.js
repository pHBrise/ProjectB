const userModel = require("../models/User");
const productModel = require("../models/Product");
const productVariationModel = require("../models/ProductVariation");
const joi = require("joi");

module.exports.addProduct = async (req, res) => {
    const playload = req.playload;

    const product = new productModel({
        title:req.body.title,
        description:req.body.description,
        
    })

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