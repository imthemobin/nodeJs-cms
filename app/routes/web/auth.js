const express = require("express");
const router = express.Router();
const passport = require("passport");

//controllers
const loginController = require("app/http/controllers/auth/loginController");
const registerController = require("app/http/controllers/auth/registerController");
const forgotPasswordController = require("app/http/controllers/auth/forgotPassword");
const resetPasswordController = require("app/http/controllers/auth/reserPasswordController");

//validaton
const registerValidation = require("app/http/validator/registerValidator");
const loginValidation = require("app/http/validator/loginValidator");
const forgotPasswordValidator = require("app/http/validator/forgotPasswordValidator");
const resetPasswordValidator = require("app/http/validator/resetPasswordValidator");

//auth Router
router.get("/login", loginController.showLoginForm);
router.post("/login", loginValidation.handler(), loginController.loginProcess);

router.get("/register", registerController.showRegsitrationForm);
router.post(
  "/register",
  registerValidation.handler(),
  registerController.registerProcess
);

router.get("/password/reset", forgotPasswordController.showForgotPasswordForm);
router.post(
  "/password/email",
  forgotPasswordValidator.handler(),
  forgotPasswordController.sendPasswordReserLink
);
router.get(
  "/password/reset/:token",
  resetPasswordController.showResetPasswordForm
);
router.post(
  "/password/reset/",
  resetPasswordValidator.handler(),
  resetPasswordController.resetPasswordProcess
);

router.get("/google", passport.authenticate("google"));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/register",
  })
);

module.exports = router;
