const validator = require("./validator");
const { check } = require("express-validator/check");

class resetPasswordValidator extends validator {
  handler() {
    return [
      check("email").isEmail().withMessage("فیلد ایمیل معتبر نیست"),
      check("token").not().isEmpty().withMessage("توکن مورد نظر ست نشده است"),
      check("password")
      .isLength({ min: 8 })
      .withMessage("فیلد پسورد نمی تواند کمتر از ۸ کاراکتر باشد"),
    ];
  }
}

module.exports = new resetPasswordValidator();
