const autoBind = require("auto-bind");
const Recaptcha = require("express-recaptcha").RecaptchaV2;

module.exports = class controller {
  constructor() {
    autoBind(this);
    this.recapchaConfig();
  }

  recapchaConfig() {
    this.recaptcha = new Recaptcha(
      "6LfyBnUpAAAAAH5WtsrvhRUt8res81zsmahVwAlb",
      "6LfyBnUpAAAAABFL5_S5SKh0NEbRjVvumzKPAdeL",
      {
        hl: "fa",
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
