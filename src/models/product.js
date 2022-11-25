const mongoose = require("mongoose");
const timeStamp = require("mongoose-timestamp");
const productSkema = new mongoose.Schema({
  lenz: {
    type: String,
    required: true,
  },
  bord: {
    type: String,
    required: true,
  },
});
productSkema.plugin(timeStamp);

const Product = mongoose.model("Product", productSkema);
module.exports = Product;
``;
