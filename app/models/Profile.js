const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
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
  mobile_number: {
    type: String
  },
  date_of_birth: {
    type: Date,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
  },
});

module.exports = mongoose.model("Profile", profileSchema);
