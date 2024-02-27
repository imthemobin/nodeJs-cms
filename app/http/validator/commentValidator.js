const validator = require("./validator");
const { check } = require("express-validator/check");
const Course = require("app/models/course");
const path = require("path");

class commentValidator extends validator {
  handler() {
    return [
      check("comment")
        .isLength({ min: 10 })
        .withMessage("متن نظر نمیتواند کمتر از ۱۰ کاراکتر باشد"),
    ];
  }
}

module.exports = new commentValidator();
