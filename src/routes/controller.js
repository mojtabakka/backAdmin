const otpGenerator = require("otp-generator");
const autoBind = (...args) =>
  import("auto-bind").then(({ default: autoBind }) => autoBind(...args));
const { validationResult } = require("express-validator");
const user = require("../models/user");
const product = require("../models/product");
const BlackList = require("../models/blacklist");
const Userp = require("../models/userp");
const Otp = require("../models/opt");
const { TaskRouterGrant } = require("twilio/lib/jwt/AccessToken");
module.exports = class {
  constructor() {
    autoBind(this);
    this.User = user;
    this.Product = product;
    this.BlackList = BlackList;
    this.UserP = Userp;
    this.Opt = Otp;
  }

  validationBody(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array();
      const messages = [];
      errors.forEach((err) => messages.push(err.msg));
      res.status(400).send({
        message: "validation error",
        data: messages,
      });
      return false;
    }
    return true;
  }

  validate(req, res, next) {
    if (!this.validationBody(req, res)) {
      return;
    }
    next();
  }

  response({ res, message, code = 200, data = {} }) {
    res.status(code).json({
      message,
      data,
    });
  }
};
