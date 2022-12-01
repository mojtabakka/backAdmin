var cors = require("cors");
const bodyParser = require("body-parser");
// ...

module.exports = function (express, app) {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser());
  app.use(express.static("public"));
};
