const express = require("express");
const router = express.Router();

// Controllers
const adminController = require("app/http/controllers/admin/adminController");
const courseController = require("app/http/controllers/admin/courseController");

//validaton
const courseValidation = require("app/http/validator/courseValidator");

router.use((req, res, next) => {
  res.locals.layout = "admin/master";
  next();
});

// Admin Routes
router.get("/", adminController.index);
router.get("/courses", courseController.index);
router.get("/courses/create", courseController.create);
router.post(
  "/courses/create",
  courseValidation.handler(),
  courseController.store
);
module.exports = router;
