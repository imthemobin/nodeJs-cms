const express = require("express");
const router = express.Router();

//controllers
const homeController = require("app/http/controllers/homeController");

//Home Router
router.get("/", homeController.index);

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
