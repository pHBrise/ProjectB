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
    min: 6,
  },
  status: {
    type: String, 
      enum: ['Pending', 'Active'],
      default: 'Pending',
  },
  confirmationCode: { 
    type: String, 
    unique: true }
});

module.exports = mongoose.model("User", userSchema);
