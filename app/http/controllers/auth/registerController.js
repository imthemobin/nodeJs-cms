const controller = require("app/http/controllers/controller");

class registerController extends controller {
  showRegsitrationForm(req, res) {
    res.render("auth/register", { messages: req.flash("errors") });
  }

  registerProcess(req, res, next) {
    this.validationData(req).then((result) => {
      if (result) return res.json("register proccess");
      else res.redirect("/register");
    });
  }

  validationData(req) {
    req.checkBody("name", "فیلد نام نمی تواند خالی باشد").notEmpty();
    req
      .checkBody("name", "فیلد نام نمی تواند کمتر از ۵ کاراکتر باشد")
      .isLength({ min: 5 });
    req.checkBody("email", "فیلد ایمیل نمی تواند خالی باشد").notEmpty();
    req.checkBody("email", "فیلد ایمیل معتبر نیست").isEmail();
    req.checkBody("password", "فیلد پسورد نمی تواند خالی باشد").notEmpty();
    req
      .checkBody("password", "فیلد پسورد نمی تواند کمتر از ۸ کاراکتر باشد")
      .isLength({ min: 8 });

    return req
      .getValidationResult()
      .then((result) => {
        const errors = result.array();
        const message = [];
        errors.forEach((error) => message.push(error.msg));

        if (message.length == 0) return true;

        req.flash("errors", message);
        return false;
      })
      .catch((error) => console.log(error));
  }
}

module.exports = new registerController();
