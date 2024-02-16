const controller = require("app/http/controllers/controller");
const passport = require("passport");

class registerController extends controller {
  showRegsitrationForm(req, res) {
    res.render("auth/register", {
      messages: req.flash("errors"),
      recaptcha: this.recaptcha.render(),
    });
  }

  registerProcess(req, res, next) {
    this.recapchaValidation(req, res)
      .then((result) => this.validationData(req))
      .then((result) => {
        if (result) this.register(req, res, next);
        else res.redirect("/register");
      })
      .catch((error) => console.log(error));
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

  register(req, res, next) {
    passport.authenticate("local.register", {
      successRedirect: "/",
      failureRedirect: "/register",
      failureFlash: true,
    })(req, res, next);
  }
}

module.exports = new registerController();
