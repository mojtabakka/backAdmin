var cors = require("cors");
const fileUpload = require("express-fileupload");

module.exports = function (express, app) {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(fileUpload());
  app.use(express.static("public"));
};
