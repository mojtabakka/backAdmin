const mongoose = require("mongoose");
const timeStamp = require("mongoose-timestamp");
const productSkema = new mongoose.Schema({
  Warranty: {
    type: String,
    require: true,
  },
  model: {
    type: String,
    required: true,
  },
  price: {
    type: String,
  },
  features: {
    type: String,
  },
  priceForUser: {
    type: String,
    required: true,
  },
  priceForWorkmate: {
    type: String,
    required: true,
  },
  exist: {
    type: Boolean,
    required: true,
  },
  photo: {
    type: String,
  },
});
productSkema.plugin(timeStamp);

const Product = mongoose.model("Product", productSkema);
module.exports = Product;
