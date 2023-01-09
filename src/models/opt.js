const mongoose = require("mongoose");
const timeStamp = require("mongoose-timestamp");
const otpSkema = new mongoose.Schema({
  otp: String,

  expiration_time: {
    type: Date,
  },
  verified: {
    type: Boolean,
    required: false,
    default: null,
  },

  phoneNumber: {
    type: String,
    required: false,
  },
});
otpSkema.plugin(timeStamp);

const otp = mongoose.model("Otp", otpSkema);
module.exports = otp;
