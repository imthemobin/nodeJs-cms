const middleware = require("./middlewares");

class rememberLogin extends middleware {
  handler(req, res, next) {
    if (req.isAuthenticated()) 
        res.redirect("/");

    next();
  }
}

module.exports = new rememberLogin();
