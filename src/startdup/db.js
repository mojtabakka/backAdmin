const mongoose = require("mongoose");
const config = require("config");
const debug = require("debug")("app:main");

module.exports = function () {
  mongoose
    .connect(config.get("db.address"))
    .then(() => debug("mongooes connected"))
    .catch(() => debug("could not connnect tfo mongodb"));
};
