const express = require("express");
const router = express.Router();

//controllers
const homeController = require("app/http/controllers/homeController");
const courseController = require("app/http/controllers/courseController");


//validaton
const commentValidation = require("app/http/validator/commentValidator");

//Middlewares
const redirectIfNotAuthenticated = require("app/http/middlewares/redirectIfNotAuthenticated");

//Home Router
router.get("/", homeController.index);
router.get("/about-me", homeController.about);
router.get("/courses", courseController.index);
router.get("/courses/:course", courseController.single);

router.get("/download/:episode", courseController.download);

router.post("/comment",redirectIfNotAuthenticated.handler,commentValidation.handler(), homeController.comment)

router.post("/courses/payment", redirectIfNotAuthenticated.handler,courseController.payment)
router.get("/courses/payment/checker", redirectIfNotAuthenticated.handler,courseController.checker)




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
