const middleware = require("./middlewares");

class redirectIfAuthenticated extends middleware {
  handler(req, res, next) {
    if (req.isAuthenticated()) 
        res.redirect("/");

    next();
  }
}

module.exports = new redirectIfAuthenticated();
