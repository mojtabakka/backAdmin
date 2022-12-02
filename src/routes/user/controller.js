const _ = require("lodash");
const controller = require("../controller");
module.exports = new (class extends controller {
  async getUser(req, res) {
    if (req.user) {
      this.response({
        res,
        message: "successfully",
        data: req.user,
      });
    } else {
      this.response({
        res,
        message: "something went wrong",
        data: req.user,
      });
    }
  }

  async updateUser(req, res) {
    try {
      const user = await this.User.findOneAndUpdate(
        { _id: req.user._id },
        _.pick(req.body, [
          "username",
          "phoneNumber",
          "name",
          "lastName",
          "email",
          "nationalCode",
          "avatar",
        ])
      );
      this.response({
        res,
        message: "successfully",
        data: user,
      });
    } catch (error) {
      this.response({
        res,
        message: "something went wrong",
        data: req.user,
      });
    }
  }

  async uploadPhoto(req, res) {
    try {
      const user = await this.User.findOneAndUpdate(
        { _id: req.user._id },
        { avatar: "asset/images/users/" + req?.file.filename }
      );
      this.response({
        res,
        message: "uploaded successfully",
        data: user,
      });
    } catch (error) {
      console.log("error", error);
    }
  }

  async getUserPhoto(req, res) {
    try {
      this.response({
        res,
        message: "uploaded successfully",
        data: null,
      });
    } catch (error) {
      console.log("error", error);
    }
  }
})();
