const { check } = require("express-validator");
const expressValidator = require("express-validator");

module.exports = new (class {
  addOrderValidator() {
    return [
      // check("token").not().isEmpty().withMessage("token can not be empty"),
    ];
  }
})();
