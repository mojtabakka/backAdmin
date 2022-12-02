const express = require("express");
const router = express.Router();
const controller = require("./controller");
const validator = require("./validator");
// router.post(
//     "/register",
//     validator.registerValidator(),
//     controller.validate.bind(controller),
//     controller.register.bind(controller)
//   );

// router.post(
//   "/login",
//   validator.loginValidator(),
//   controller.validate.bind(controller),
//   controller.login.bind(controller)
// );
router.post(
  "/product",
  validator.createProductValidator(),
  controller.validate.bind(controller),
  controller.createProduct.bind(controller)
);

router.get(
  "/product",
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
