const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

module.exports = function (express, app) {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser());
  app.use(express.static("public"));
  app.use(logger("common"));
};
