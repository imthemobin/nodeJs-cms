const validator = require("./validator");
const { check } = require("express-validator/check");
const Category = require("app/models/category");

class categoryValidator extends validator {
  handler() {
    return [
      check("name")
        .isLength({ min: 3 })
        .withMessage("عنوان نمیتواند کمتر از 3 کاراکتر باشد")
        .custom(async (value, { req }) => {
          if (req.query._method === "put") {
            let category = await Category.findById(req.params.id);
            if (category.title === value) return;
          }
          let category = await Category.findOne({ name: value });
          if (category) {
            throw new Error(
              "چنین دسته بندی با این عنوان قبلا در سایت قرار داد شده است"
            );
          }
        }),

      check("parent")
        .not()
        .isEmpty()
        .withMessage("فیلد دسته بندی مربوطه نمیتواند خالی بماند"),
    ];
  }
}

module.exports = new categoryValidator();