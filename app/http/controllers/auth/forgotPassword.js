const controller = require("app/http/controllers/controller");
const passport = require("passport");
const User = require("app/models/user");
const PasswordReset = require("app/models/password_reset");
const uniqueString = require("unique-string");
const { parse } = require("dotenv");

class forgotPasswordController extends controller {
  showForgotPasswordForm(req, res) {
    const title = "فراموشی رمز عبور";
    res.render("home/auth/forgot_password/email", {
      errors: req.flash("errors"),
      recaptcha: this.recaptcha.render(),
      title: title,
    });
  }

  async sendPasswordReserLink(req, res, next) {
    await this.recapchaValidation(req, res);

    let result = await this.validationData(req);

    if (result) return this.sendResetLink(req, res, next);

    return res.redirect("/password/reset");
  }

  async sendResetLink(req, res, next) {
    const existingUser = await User.findOne({ email: req.body.email });

    if (!existingUser) {
      req.flash("errors", "چنین کاربری با این مشخصات وجود ندارد");
      return this.back(req, res);
    }

    const newPAsswordReset = new PasswordReset({
      email: req.body.email,
      token: uniqueString(),
    });

    await newPAsswordReset.save();

    //send mail

    // req.flash('success', 'رمز عبور شما با موفقیت تغیر کرد')
    res.redirect("/");
  }
}

module.exports = new forgotPasswordController();
