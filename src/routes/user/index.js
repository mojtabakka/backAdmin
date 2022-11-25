const express = require("express");
const router = express.Router();
const controller = require("./controller");
const validator = require("./validator");

router.get("/user", controller.getUser.bind(controller));
router.patch("/user", controller.updateUser.bind(controller));
module.exports = router;
