const middleware = require("./middlewares");

class redirectIfAuthenticated extends middleware {
  handler(req, res, next) {
    if (req.isAuthenticated()) 
       return res.redirect("/");

    return next();
  }
}

module.exports = new redirectIfAuthenticated();
