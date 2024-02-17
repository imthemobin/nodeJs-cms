const controller = require("app/http/controllers/controller");
const passport = require("passport");

class loginController extends controller {
  showLoginForm(req, res) {
    res.render("auth/login", {
      errors: req.flash("errors"),
      recaptcha: this.recaptcha.render(),
    });
  }

  loginProcess(req, res, next) {
    this.validationData(req).then((result) => {
      if (result) this.login(req, res, next);
      else res.redirect("/login");
    });
  }

  validationData(req) {
    req.checkBody("email", "فیلد ایمیل معتبر نیست").isEmail();
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

  login(req, res, next) {
    passport.authenticate("local.login",(error, user)=>{
      if(!user) return res.redirect('/login')

      req.login(user, error=>{
        if(req.body.remember){
          req.user.setRememberToken(res)
        }
        res.redirect('/')
      })
    })(req, res, next);
  }
}

module.exports = new loginController();
