const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        items: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            product_variation: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ProductVariation',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
        }],
        totalPrice: {
            type: Number,
            required: true
        },
        totalItems: {
            type: Number,
            required: true
        },
    }, { timestamps: true }
)

module.exports = mongoose.model("Cart", cartSchema);