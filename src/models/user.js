const mongoose = require("mongoose");
const timeStamp = require("mongoose-timestamp");
const userSkema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  nationalCode: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
  },
  avatar: {
    type: String,
  },
});
userSkema.plugin(timeStamp);

const User = mongoose.model("User", userSkema);
module.exports = User;
