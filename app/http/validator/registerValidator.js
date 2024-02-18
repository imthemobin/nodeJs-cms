const validator = require("./validator");
const { check } = require("express-validator/check");

class registerValidator extends validator {
  handler() {
    return [
      check("name")
        .isLength({ min: 5 })
        .withMessage("فیلد نام نمی تواند کمتر از ۵ کاراکتر باشد"),

      check("email").isEmail().withMessage("فیلد ایمیل معتبر نیست"),

      check("password")
        .isLength({ min: 8 })
        .withMessage("فیلد پسورد نمی تواند کمتر از ۸ کاراکتر باشد"),
    ];
  }
}

module.exports = new registerValidator();
