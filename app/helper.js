const path = require('path')

module.exports = class helper {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  getObject() {
    return {
      auth: this.auth(),
      viewPath: this.viewPath
    };
  }

  auth() {
    return {
      user: this.req.user,
      check: this.req.isAuthenticated(),
    };
  }

  viewPath(dir){
    return path.resolve(config.layouts.view_dir + '/' + dir)
  }
};
