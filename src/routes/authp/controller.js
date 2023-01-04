const _ = require("lodash");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { AddMinutesToDate } = require("../../utile/function.util");
const { encode, decode } = require("../../middlewares/crypt");

const controller = require("../controller");

module.exports = new (class extends controller {
  async register(req, res) {
    let user = await this.User.findOne({ email: req.body.email });
    if (user)
      return this.response({
        res,
        message: "this user is already registered",
        code: 400,
        data: null,
      });

    const items = _.pick(req.body, [
      "name",
      "email",
      "password",
      "name",
      "lastName",
      "phoneNumber",
      "username",
      "nationalCode",
    ]);

    items.avatar = null;
    user = await this.User(items);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    this.response({
      res,
      message: "this user successfully registered",
      data: _.pick(user, ["_id", "email", "name"]),
    });
  }
  async login(req, res) {
    const otpCode = otpGenerator.generate(4, {
      digits: true,
      alphabets: false,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 10);
    const otp = this.Opt({ otp: otpCode, expiration_time });
    const otp_instance = await otp.save();
    const details = {
      timestamp: now,
      check: "mojtaba.karimi.mo@gmail.com",
      success: true,
      message: "OTP sent to user",
      otp_id: otp_instance._id,
    };

    // const encoded = await encode(JSON.stringify(details));

    this.response({
      res,
      message: "successfully loged in",
      data: [{ otp: null }],
    });

    // const user = await this.User.findOne({ email: req.body.email });
    // if (!user) {
    //   this.response({ res, message: "password or email invalid", code: 400 });
    // }
    // const result = await bcrypt.compare(req.body.password, user.password);
    // if (!result) {
    //   this.response({ res, message: "password or email invalid", code: 400 });
    //   return false;
    // }
    // const token = jwt.sign({ id: user._id }, config.get("jwt_key"), {
    //   expiresIn: "1d",
    // });
    // const data = {
    //   token,
    //   name: user.name,
    //   lastName: user.lastName,
    //   phoneNumber: user.phoneNumber,
    // };
    // this.response({ res, message: "successfully loged in", data });
  }

  async logout(req, res) {
    const blacklist = await this.BlackList(_.pick(req.body, ["token"]));
    await blacklist.save();
    this.response({
      res,
      message: "logout successfully",
      data: otp,
    });
  }
})();
