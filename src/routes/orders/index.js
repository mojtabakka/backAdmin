const express = require("express");
const router = express.Router();
const controller = require("./controller");
const baseController = require("../controller");
const validator = require("./validator");

router.post(
  "",
  validator.addOrderValidator(),
  controller.validate.bind(controller),
  controller.addOrder.bind(controller)
);

module.exports = router;
