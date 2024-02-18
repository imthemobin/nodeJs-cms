const controller = require("app/http/controllers/controller");
const passport = require("passport");

class loginController extends controller {
  showLoginForm(req, res) {
    const title = 'صفحه ورود'
    res.render("home/auth/login", {
      errors: req.flash("errors"),
      recaptcha: this.recaptcha.render(),
      title: title
    });
  }

  loginProcess(req, res, next) {
    this.recapchaValidation(req, res)
      .then((result) => this.validationData(req))
      .then((result) => {
        if (result) this.login(req, res, next);
        else res.redirect("/login");
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
