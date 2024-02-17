const express = require("express");
const router = express.Router();

//controllers
const homeController = require("app/http/controllers/homeController");
const loginController = require("app/http/controllers/auth/loginController");
const registerController = require("app/http/controllers/auth/registerController");

//Middlewares
const redirectIfAuthenticated = require("app/http/middlewares/redirectIfAuthenticated");

//Home Router
router.get("/", homeController.index);

router.get("/login", redirectIfAuthenticated.handler, loginController.showLoginForm);
router.post("/login", redirectIfAuthenticated.handler, loginController.loginProcess);

router.get(
  "/register",
  redirectIfAuthenticated.handler,
  registerController.showRegsitrationForm
);
router.post(
  "/register",
  redirectIfAuthenticated.handler,
  registerController.registerProcess
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    res.clearCookie("remember_token");
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
