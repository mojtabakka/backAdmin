const _ = require("lodash");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const controller = require("../controller");

module.exports = new (class extends controller {
  async addOrder(req, res) {
    // let user = await this.UserP.findOne({ phoneNumber: req.body.phoneNumber });
    // if (user)
    //   return this.response({
    //     res,
    //     message: "this user is already registered",
    //     code: 400,
    //     data: null,
    //   });
    // const items = _.pick(req.body, [
    //   "name",
    //   "email",
    //   "password",
    //   "name",
    //   "lastName",
    //   "phoneNumber",
    //   "nationalCode",
    // ]);
    // items.avatar = null;
    // user = await this.User(items);
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(user.password, salt);
    // await user.save();
    this.response({
      res,
      message: "this user successfully registered",
      data: null,
    });
  }
})();
