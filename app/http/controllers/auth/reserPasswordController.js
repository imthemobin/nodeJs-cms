const controller = require("app/http/controllers/controller");
const passport = require("passport");
const User = require("app/models/user");
const PasswordReset = require("app/models/password_reset");
const uniqueString = require("unique-string");
const bcrypt = require("bcrypt");

class resetPasswordController extends controller {
  async showResetPasswordForm(req, res) {
    let email = await PasswordReset.findOne({token: req.params.token})
    console.log(email);
    const title = "تغیر رمز عبور";
    res.render("home/auth/forgot_password/reset", {
      recaptcha: this.recaptcha.render(),
      title: title,
      token: req.params.token,
      email: email,
    });
  }

  async resetPasswordProcess(req, res, next) {
    await this.recapchaValidation(req, res);

    let result = await this.validationData(req);

    if (result) return this.resetPassword(req, res, next);

    
    req.flash('formData', req.body)
    return res.redirect("/password/reset/" + req.body.token);

    // return this.back(req,res)
  }

  async resetPassword(req, res, next) {
    let field = await PasswordReset.findOne({
      $and: [{ email: req.body.email }, { token: req.body.token }],
    });

    if (!field) {
      req.flash("errors", "اطلاعات وارد شده صحیح نیست");
      return this.back(req, res);
    }

    if (field.use) {
      req.flash("errors", "از این لینک برای بازیابی قبلا استفاده شده است");
      return this.back(req, res);
    }

    let existingUser = await User.findOneAndUpdate(
      { email: field.email },
      { $set: { password: bcrypt.hashSync(req.body.password, 10), } }
    );

    if (!existingUser) {
      req.flash("errors", "آپدیت انجام نشد");
      return this.back(req, res);
    }

    field.use = true;
    await field.save()

    res.redirect('/login')
  }
}

module.exports = new resetPasswordController();
