const middleware = require("./middlewares");

class redirectIfNotAuthenticated extends middleware {
  handler(req, res, next) {
    if (req.isAuthenticated()) return next();


    return res.redirect("/login");
  }
}

module.exports = new redirectIfNotAuthenticated();
