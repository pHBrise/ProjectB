const mongoose = require("mongoose");

const profileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
    },
    first_name: {
      type: String,
      max: 50,
      min: 0,
    },
    last_name: {
      type: String,
      max: 50,
      min: 0,
    },
    image: {

    },
    email: {
      type: String,
      required: true,
      max: 225,
      min: 0,
    },
    mobile_number: {
      type: String
    },
    date_of_birth: {
      type: Date,
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Profile", profileSchema);
