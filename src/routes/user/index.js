const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { uploadImage } = require("../../middlewares/file");

router.get("/user", controller.getUser.bind(controller));
router.patch("/user", controller.updateUser.bind(controller));
router.post(
  "/upload-image",
  uploadImage,
  controller.uploadPhoto.bind(controller)
);
router.post(
  "/upload-image",
  uploadImage,
  controller.uploadPhoto.bind(controller)
);

router.get("/user-photo", controller.getUserPhoto.bind(controller));
module.exports = router;
