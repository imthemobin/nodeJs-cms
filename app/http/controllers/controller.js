const autoBind = require("auto-bind");
const Recaptcha = require("express-recaptcha").RecaptchaV2;

module.exports = class controller {
  constructor() {
    autoBind(this);
    this.recapchaConfig();
  }

  recapchaConfig() {
    this.recaptcha = new Recaptcha(
      config.service.recaptcha.site_key,
      config.service.recaptcha.secret_key,
      {
        ...config.service.recaptcha.option,
      }
    );
  }

  recapchaValidation(req, res) {
    return new Promise((resolve, reject) => {
      this.recaptcha.verify(req, (error, data) => {
        if (!error) {
          resolve(true);
        } else {
          req.flash(
            "errors",
            "گزینه امنیتی مربوط به این که من ربات نیستم را چک کنید و مجدد تلاش فرماید"
          );
          res.redirect(req.url);
        }
      });
    });
  }
};
