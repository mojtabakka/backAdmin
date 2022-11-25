const mongoose = require("mongoose");
const timeStamp = require("mongoose-timestamp");
const blackListtSkema = new mongoose.Schema({
  token: {
    type: String,
  },
});
blackListtSkema.plugin(timeStamp);

const BlackList = mongoose.model("BlackList", blackListtSkema);
module.exports = BlackList;
