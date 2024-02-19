const controller = require("app/http/controllers/controller");
const passport = require("passport");

class registerController extends controller {
  showRegsitrationForm(req, res) {
    const title = "صفحه عضویت";
    res.render("home/auth/register", {
      errors: req.flash("errors"),
      recaptcha: this.recaptcha.render(),
      title: title,
    });
  }

  async registerProcess(req, res, next) {
    await this.recapchaValidation(req, res);

    let result = await this.validationData(req);

    if (result) return this.register(req, res, next);

    return res.redirect("/register");
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
