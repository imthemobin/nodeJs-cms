const express = require("express");
const router = express.Router();

// Controllers
const adminController = require("app/http/controllers/admin/adminController");
const courseController = require("app/http/controllers/admin/courseController");
const episodeController = require("app/http/controllers/admin/episodeController");
const commentController = require("app/http/controllers/admin/commentController");
const categoryController = require("app/http/controllers/admin/categoryController");

//validaton
const courseValidation = require("app/http/validator/courseValidator");
const episodeValidation = require("app/http/validator/episodeValidator");
const categoryValidation = require("app/http/validator/categoryValidator");

// Helper
const upload = require("app/helper/uploadImage");

// Middlewares
const convertFileToField = require("app/http/middlewares/converFileToField");

router.use((req, res, next) => {
  res.locals.layout = "admin/master";
  next();
});

// Admin Routes
router.get("/", adminController.index);

// course route
router.get("/courses", courseController.index);
router.get("/courses/create", courseController.create);
router.post(
  "/courses/create",
  upload.single("images"),
  convertFileToField.handler,
  courseValidation.handler(),
  courseController.store
);
router.delete("/courses/:id", courseController.destroy);
router.get("/courses/:id/edit", courseController.edit);
router.put(
  "/courses/:id",
  upload.single("images"),
  convertFileToField.handler,
  courseValidation.handler(),
  courseController.update
);

// episode route
router.get("/episodes", episodeController.index);
router.get("/episodes/create", episodeController.create);
router.post(
  "/episodes/create",
  episodeValidation.handler(),
  episodeController.store
);
router.delete("/episodes/:id", episodeController.destroy);
router.get("/episodes/:id/edit", episodeController.edit);
router.put(
  "/episodes/:id",
  episodeValidation.handler(),
  episodeController.update
);

// category route
router.get("/categories", categoryController.index);
router.get("/categories/create", categoryController.create);
router.post(
  "/categories/create",
  categoryValidation.handler(),
  categoryController.store
);
router.delete("/categories/:id", categoryController.destroy);
router.get("/categories/:id/edit", categoryController.edit);
router.put(
  "/categories/:id",
  categoryValidation.handler(),
  categoryController.update
);


router.get("/comments/approved", commentController.approved)
router.get("/comments",commentController.index)
router.put("/comments/:id/approved", commentController.update);
router.delete("/comments/:id", commentController.destroy);


router.post("/upload-image", upload.single("upload"),adminController.uploadImage)

module.exports = router;
