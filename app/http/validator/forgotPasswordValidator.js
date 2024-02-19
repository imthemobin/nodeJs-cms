const validator = require("./validator");
const { check } = require("express-validator/check");

class forgotPasswordValidator extends validator {
  handler() {
    return [
      check("email").isEmail().withMessage("فیلد ایمیل معتبر نیست"),
    ];
  }
}

module.exports = new forgotPasswordValidator();
