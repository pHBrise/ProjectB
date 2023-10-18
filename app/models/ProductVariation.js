const mongoose = require("mongoose");

const productVariationSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    sku: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    image: {
        type: String
    },
    attributes: [
        {
            name: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            },
        }
    ]
});

module.exports = mongoose.model("ProductVariation", productVariationSchema);
