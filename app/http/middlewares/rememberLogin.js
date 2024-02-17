const User = require("app/models/user");
const middleware = require("./middlewares");

class rememberLogin extends middleware {
  handler(req, res, next) {
    if (!req.isAuthenticated()) {
      const rememberToken = req.signedCookies.remember_token;
      if (rememberToken) {
        return this.userFind(req,rememberToken, next);
      }
    }
    next();
  }

  async userFind(req,rememberToken, next) {
    try {
      const user = await User.findOne({ rememberToken: rememberToken });
  
      if (user) {
        req.login(user, (error) => {
          if (error) {
            next(error);
          } else {
            next();
          }
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  }
  
}

module.exports = new rememberLogin();
