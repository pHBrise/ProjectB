const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    currency_id: {
      type: String,
      required: true,
      default: "THB"
    },
    currency_format: {
      type: String,
      required: true,
      default: "฿"
    },
    free_shipping: {
      type: Boolean,
      default: false
    },
    product_image: [{
      type: String,
      //required: true
    }],
    category: [{
      type: String
    }],
    brand: {
      type: String
    },
    variations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductVariation',
      required: true
    }],
    installments: {
      type: Number
    },
    deletedAt: {
      type: Date
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);