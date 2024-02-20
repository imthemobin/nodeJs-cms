const path = require("path");
const autoBind = require("auto-bind");

module.exports = class helper {
  constructor(req, res) {
    autoBind(this);
    this.req = req;
    this.res = res;
    this.formData = req.flash("formData")[0];
  }

  getObject() {
    return {
      auth: this.auth(),
      viewPath: this.viewPath,
      ...this.globalVaribales,
      old: this.old,
    };
  }

  auth() {
    return {
      user: this.req.user,
      check: this.req.isAuthenticated(),
    };
  }

  viewPath(dir) {
    return path.resolve(config.layouts.view_dir + "/" + dir);
  }

  globalVaribales() {
    return {
      errors: this.req.flash("errors "),
    };
  }

  old(field, defaultValue = "") {
    let formData = this.req.flash("formData")[0];
    return this.formData && this.formData.hasOwnProperty(field)
      ? this.formData[field]
      : defaultValue;
  }
};
