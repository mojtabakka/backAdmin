const mongoose = require("mongoose");
const timeStamp = require("mongoose-timestamp");
const productSkema = new mongoose.Schema({
  _id: {},
  otp: String,
  expiration_time: {
    type: Date,
  },
  verified: {
    type: Boolean,
    required: false,
    default: null,
  },
});
productSkema.plugin(timeStamp);

const Product = mongoose.model("Otp", productSkema);
module.exports = Product;
