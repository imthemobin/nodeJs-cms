const express = require("express");
const router = express.Router();

//controllers
const homeController = require("app/http/controllers/homeController");
const courseController = require("app/http/controllers/courseController");
const userController = require("app/http/controllers/userController");


//validaton
const commentValidation = require("app/http/validator/commentValidator");
const editInfoValidation = require("app/http/validator/editInfoValidator");

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


router.get("/user/panel", userController.index)
router.get("/user/panel/history", userController.history)
router.get("/user/panel/vip", userController.vip)
router.post("/user/panel/vip/payment", userController.payment)
router.get("/user/panel/vip/payment/check", userController.paymentCheck)
router.put(
  "/user/panel/:id",
  editInfoValidation.handler(),
  userController.update
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

// for seo
router.get('/sitemap.xml' , homeController.sitemap);

// for rss feed
router.get('/feed/courses' , homeController.feedCourses);
router.get('/feed/episodes' , homeController.feedEpisodes);

module.exports = router;
