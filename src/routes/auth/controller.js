const _ = require("lodash");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
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
    const user = await this.User.findOne({ email: req.body.email });

    if (!user) {
      this.response({ res, message: "password or email invalid", code: 400 });
    }
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) {
      this.response({ res, message: "password or email invalid", code: 400 });
      return false;
    }
    const token = jwt.sign({ id: user._id }, config.get("jwtp_key"), {
      expiresIn: "1d",
    });
    const data = {
      token,
      name: user.name,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
    };
    this.response({ res, message: "successfully loged in", data });
  }

  async logout(req, res) {
    const blacklist = await this.BlackList(_.pick(req.body, ["token"]));
    await blacklist.save();
    this.response({
      res,
      message: "logout successfully",
      data: null,
    });
  }
})();
