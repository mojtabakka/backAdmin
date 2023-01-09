const _ = require("lodash");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const { AddMinutesToDate } = require("../../utile/function.util");
const { encode, decode } = require("../../middlewares/crypt");
const { EMAIL_PASSWORD, EMAIL_ADDRESS } = require("../../../config/variables");

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
  async sendOtp(req, res) {
    // let email_message;
    // let email_subject;
    const otpCode = otpGenerator.generate(4, {
      digits: true,
      alphabets: false,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 1);
    const otp = this.Opt({
      phoneNumber: req.body.phoneNumber,
      otp: otpCode,
      expiration_time,
    });

    const otp_instance = await otp.save();
    // const details = {
    //   timestamp: now,
    //   check: "mojtaba.karimi.momo@gmail.com",
    //   success: true,
    //   message: "OTP sent to user",
    //   otp_id: otp_instance._id,
    // };
    // const encoded = await encode(JSON.stringify(details));

    // this.response({
    //   res,
    //   message: "successfully loged in",
    //   data: [{ otp: null }],
    // });
    // const {
    //   message,
    //   subject_mail,
    // } = require("../../templates/email_verification");

    // email_message = message(otpCode);
    // email_subject = subject_mail;

    // const transporter = nodemailer.createTransport({
    //   host: "gmail",
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: `${EMAIL_ADDRESS}`,
    //     pass: `${EMAIL_PASSWORD}`,
    //   },
    // });
    // console.log(transporter);
    // const mailOptions = {
    //   from: `"Divyansh Agarwal"<${EMAIL_ADDRESS}>`,
    //   to: `${"mojtaba.karimi.momo@gmail.com"}`,
    //   subject: email_subject,
    //   text: email_message,
    // };

    // const result = await transporter.verify();
    // console.log("hello");
    // console.log(result);

    // const user = await thisf.User.findOne({ email: req.body.email });
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
    this.response({
      res,
      message: "Otp",
      data: {
        sent: true,
      },
    });
  }

  async verification(req, res) {
    let user;
    let token;
    try {
      const otp = await this.Opt.findOne({
        phoneNumber: req.body.phoneNumber,
        otp: req.body.otp,
      });
      if (otp === null) {
        this.response({
          code: 400,
          res,
          message: "opt is invalid",
          data: null,
        });
        ƒ;
      }
      const now = new Date().getTime() / 60000;
      const expiration_time = otp.expiration_time / 60000;
      const subTimes = expiration_time - now;
      if (subTimes < 0) {
        this.response({
          code: 400,
          res,
          message: "The opt has expired",
          data: null,
        });
      }
      user = await this.UserP.findOne({
        phoneNumber: req.body.phoneNumber,
      });
      if (!user) {
        user = this.UserP({
          phoneNumber: req.body.phoneNumber,
        });
        await user.save();
      }

      token = jwt.sign({ id: user._id }, config.get("jwtp_key"), {
        expiresIn: "100d",
      });
      this.response({
        res,
        message: "verified successfully",
        data: {
          token,
        },
      });
    } catch (error) {
      console.log("error", error);
    }
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
