const controller = require("app/http/controllers/controller");
const passport = require("passport");

class loginController extends controller {
  showLoginForm(req, res) {
    const title = "صفحه ورود";
    res.render("home/auth/login", {
      recaptcha: this.recaptcha.render(),
      title: title,
    });
  }

  async loginProcess(req, res, next) {
    await this.recapchaValidation(req, res);

    let result = await this.validationData(req);

    if (result) return this.login(req, res, next);

    return this.back(req, res);
  }

  login(req, res, next) {
    passport.authenticate("local.login", (error, user) => {
      if (!user) return res.redirect("/login");

      req.login(user, (error) => {
        if (req.body.remember) {
          req.user.setRememberToken(res);
        }
        res.redirect("/");
      });
    })(req, res, next);
  }
}

module.exports = new loginController();
