const express = require("express");
const router = express.Router();
const passport = require('passport');

//controllers
const homeController = require("app/http/controllers/homeController");
const loginController = require("app/http/controllers/auth/loginController");
const registerController = require("app/http/controllers/auth/registerController");

//validaton
const registerValidation = require("app/http/validator/registerValidator");
const loginValidation = require("app/http/validator/loginValidator");
;

//auth Router
router.get("/login", loginController.showLoginForm);
router.post("/login", loginValidation.handler(), loginController.loginProcess);

router.get("/register", registerController.showRegsitrationForm);
router.post(
  "/register",
  registerValidation.handler(),
  registerController.registerProcess
);

router.get('/google' ,passport.authenticate('google'));
router.get("/google/callback",passport.authenticate('google' , { successRedirect : '/' , failureRedirect : '/register' }));

module.exports = router;
