const expressValidator = require("express-validator");
const check = expressValidator.check;

module.exports = new (class {
  createProductValidator() {
    return [
      check("token").not().isEmpty().withMessage("token can not be empty"),
    ];
  }
})();
