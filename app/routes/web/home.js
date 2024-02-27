const express = require("express");
const router = express.Router();

//controllers
const homeController = require("app/http/controllers/homeController");
const courseController = require("app/http/controllers/courseController");

//Home Router
router.get("/", homeController.index);
router.get("/about-me", homeController.about);
router.get("/courses", courseController.index);
router.get("/courses/:course", courseController.single);
router.get("/download/:episode", courseController.download);




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
