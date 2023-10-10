const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 8,
  },
  email_confirmed: {
    type: Boolean,
    default: false,
  },
  secret_login: {
    type: String,
    unique: true,
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  },
});

module.exports = mongoose.model("User", userSchema);
