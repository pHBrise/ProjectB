const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
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
  }
});

module.exports = mongoose.model("User", userSchema);
