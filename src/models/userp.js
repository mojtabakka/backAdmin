const mongoose = require("mongoose");
const timeStamp = require("mongoose-timestamp");
const productSkema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  nationalCode: {},
  name: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phoneNumber: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  isWorkMate: {
    type: Boolean,
  },
  avatar: {
    type: String,
  },
});
productSkema.plugin(timeStamp);

const Product = mongoose.model("Userp", productSkema);
module.exports = Product;
