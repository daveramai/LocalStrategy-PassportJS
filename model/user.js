const mongoose = require("mongoose");

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  hash: String,
  salt: String,
});
// Defines the model that we will use in the app
module.exports = mongoose.model("User", UserSchema);
