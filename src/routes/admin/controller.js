const _ = require("lodash");
// const bcrypt = require("bcrypt");
// const config = require("config");
// const jwt = require("jsonwebtoken");
const controller = require("../controller");

module.exports = new (class extends controller {
  async dashboard(req, res) {
    res.send("admin dashboard");
  }
})();
