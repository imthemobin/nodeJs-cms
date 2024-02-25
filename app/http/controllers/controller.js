const autoBind = require("auto-bind");
const Recaptcha = require("express-recaptcha").RecaptchaV2;
const { validationResult } = require("express-validator/check");
const isMongoId = require("validator/lib/isMongoId")

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
          this.back(req, res);
          // res.redirect(req.url);
        }
      });
    });
  }

  async validationData(req) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const errors = result.array();
      const message = [];
      errors.forEach((error) => message.push(error.msg));

      req.flash("errors", message);
      return false;
    }
    return true;
  }

  back(req, res) {
    req.flash("formData", req.body);
    return res.redirect(req.header("Referer") || "/");
  }

  isMongoId(params) {
    if(! isMongoId(params)){
      this.error("آیدی وارد شده صحیح نیست",404)
    }
  }

  error(message , status=500){
    let error = new Error(message)
    error.status = status;
    throw error;
  }
};
