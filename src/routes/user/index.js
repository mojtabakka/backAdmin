const express = require("express");
const router = express.Router();
const controller = require("./controller");
const validator = require("./validator");

router.get("/user", controller.getUser.bind(controller));
router.patch("/user", controller.updateUser.bind(controller));
router.post("/upload-image", controller.uploadPhoto.bind(controller));
module.exports = router;
