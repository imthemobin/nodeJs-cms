const validator = require("./validator");
const { check } = require("express-validator/check");

class loginValidator extends validator {
  handler() {
    return [
      check("email").isEmail().withMessage("فیلد ایمیل معتبر نیست"),

      check("password")
        .isLength({ min: 8 })
        .withMessage("فیلد پسورد نمی تواند کمتر از ۸ کاراکتر باشد"),
    ];
  }
}

module.exports = new loginValidator();
