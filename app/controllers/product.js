const userModel = require("../models/User");
const productModel = require("../models/Product");
const productVariationModel = require("../models/ProductVariation");
const joi = require("joi");

module.exports.addProduct = async (req, res) => {
    const playload = req.playload;
    const product = new productModel()
    if (!req.body.variations) {res.status(400).json({message: "create product error"})}
    const productVariation = req.body.variations.map(variation => {
        const variationModel = new productVariationModel()
        variationModel.product = product._id;
        variationModel.sku = variation.sku;
        variationModel.price = variation.price;
        variationModel.stock = variation.stock;
        variationModel.image = variation.image;
        variationModel.attributes = variation.attributes;
        return variationModel
    })

    product.title = req.body.title;
    product.description = req.body.description;
    if (req.files) {
        product.product_image = req.files.map(file => {file.originalname});
    }
    product.variations = productVariation
    await product.save()
    res.status(200).json({
        message: "Success",
        data: product
    }) 
}