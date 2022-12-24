const express = require("express");
const router = express.Router();
const controller = require("./controller");
const validator = require("./validator");
const { uploadImage } = require("../../middlewares/file");
router.post(
  "/product",
  validator.createProductValidator(),
  controller.validate.bind(controller),
  controller.createProduct.bind(controller)
);

router.post(
  "/upload-product-image",
  uploadImage,
  controller.uploadProductImage.bind(controller)
);

router.get(
  "/product",
  controller.validate.bind(controller),
  controller.getProducts.bind(controller)
);

router.get(
  "/product/:id",
  controller.validate.bind(controller),
  controller.getProduct.bind(controller)
);

router.delete(
  "/product",
  validator.createProductValidator(),
  controller.validate.bind(controller),
  controller.deleteProduct.bind(controller)
);

router.patch(
  "/product",
  validator.createProductValidator(),
  controller.validate.bind(controller),
  controller.editProduct.bind(controller)
);
module.exports = router;
