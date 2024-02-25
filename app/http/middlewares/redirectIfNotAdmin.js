const middleware = require("./middlewares");

class redirectIfNotAdmin extends middleware {
  handler(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) return next();

    return res.redirect("/");
  }
}

module.exports = new redirectIfNotAdmin();
