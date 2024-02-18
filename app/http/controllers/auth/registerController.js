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

  registerProcess(req, res, next) {
    this.recapchaValidation(req, res)
      .then((result) => this.validationData(req))
      .then((result) => {
        if (result) this.register(req, res, next);
        else res.redirect("/register");
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
