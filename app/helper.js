module.exports = class helper {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  getObject() {
    return {
      auth: this.auth(),
    };
  }

  auth() {
    return {
      user: this.req.user,
      check: this.req.isAuthenticated(),
    };
  }
};
