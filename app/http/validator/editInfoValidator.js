const validator = require("./validator");
const { check } = require("express-validator/check");
const User = require("app/models/user");

class editInfoValidator extends validator {
  handler() {
    return [
      check("newName")
        .isLength({ min: 5 })
        .withMessage("فیلد نام نمی تواند کمتر از ۵ کاراکتر باشد"),

      check("newEmail").isEmail().withMessage("فیلد ایمیل معتبر نیست").custom(async (value, { req }) => {
        if (req.query._method === "put") {
          let user = await User.findById(req.params.id);
          if (user.email === value) return;
        }
        let user = await User.findOne({ email:value });
        if (user) {
          throw new Error(
            "چنین ایمیلی قبلا در سایت ثبت نام نموده است"
          );
        }
      }),
      check("newPassword")
        .isLength({ min: 8 })
        .withMessage("فیلد پسورد نمی تواند کمتر از ۸ کاراکتر باشد"),
    ];
  }
}

module.exports = new editInfoValidator();
