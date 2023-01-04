const { check } = require("express-validator");
const expressValidator = require("express-validator");

module.exports = new (class {
  registerValidator() {
    return [
      check("mail").not().isEmail().withMessage(" ایمیل نمی تواند خالی باشد"),
      check("name").not().isEmpty().withMessage(" نام نمی توند خالی باشد"),
      check("lastName")
        .not()
        .isEmpty()
        .withMessage(" نام خانوادگی نمی توند خالی باشد"),
      check("password")
        .not()
        .isEmpty()
        .withMessage("رمز عبور نمی تواند خالی باشد"),
      check("username")
        .not()
        .isEmpty()
        .withMessage("نام کاربری نمی تواند خالی باشد"),
      check("phoneNumber")
        .not()
        .isEmpty()
        .withMessage("شماره تماس  نمی تواند خالی باشد"),
      check("nationalCode")
        .not()
        .isEmpty()
        .withMessage("شماره ملی  نمی تواند خالی باشد"),
    ];
  }

  loginValidator() {
    return [
      check("phoneNumber")
        .not()
        .isEmpty()
        .withMessage("Phone number can not be empty"),
    ];
  }

  logoutValidator() {
    return [
      check("token").not().isEmpty().withMessage("token can not be empty"),
    ];
  }
})();
