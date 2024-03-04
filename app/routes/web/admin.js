const express = require("express");
const router = express.Router();
const gate = require("app/helper/gate");

// Controllers
const adminController = require("app/http/controllers/admin/adminController");
const courseController = require("app/http/controllers/admin/courseController");
const episodeController = require("app/http/controllers/admin/episodeController");
const commentController = require("app/http/controllers/admin/commentController");
const categoryController = require("app/http/controllers/admin/categoryController");
const userController = require("app/http/controllers/admin/userController");
const permissionController = require("app/http/controllers/admin/permissionController");
const roleController = require("app/http/controllers/admin/roleController");

//validaton
const courseValidation = require("app/http/validator/courseValidator");
const episodeValidation = require("app/http/validator/episodeValidator");
const categoryValidation = require("app/http/validator/categoryValidator");
const registerValidation = require("app/http/validator/registerValidator");
const permissionValidation = require("app/http/validator/permissionValidator");
const roleValidation = require("app/http/validator/roleValidator");

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
router.get("/courses", gate.can("show-courses"), courseController.index);
router.get("/courses/create",gate.can("store-courses"), courseController.create);
router.post(
  "/courses/create",
  gate.can("store-courses"),
  upload.single("images"),
  convertFileToField.handler,
  courseValidation.handler(),
  courseController.store
);
router.delete("/courses/:id",gate.can("delete-courses"), courseController.destroy);
router.get("/courses/:id/edit", gate.can("edit-courses"),courseController.edit);
router.put(
  "/courses/:id",
  gate.can("edit-courses"),
  upload.single("images"),
  convertFileToField.handler,
  courseValidation.handler(),
  courseController.update
);

// episode route
router.get("/episodes", gate.can("show-episodes"),episodeController.index);
router.get("/episodes/create", gate.can("store-episodes"),episodeController.create);
router.post(
  "/episodes/create",
  gate.can("store-episodes"),
  episodeValidation.handler(),
  episodeController.store
);
router.delete("/episodes/:id",gate.can("delete-episodes"), episodeController.destroy);
router.get("/episodes/:id/edit", gate.can("edit-episodes"),episodeController.edit);
router.put(
  "/episodes/:id",
  gate.can("edit-episodes"),
  episodeValidation.handler(),
  episodeController.update
);


// permission route
router.get("/users/permissions",gate.can("all-access-permissions"),permissionController.index);
router.get("/users/permissions/create",gate.can("all-access-permissions"), permissionController.create);
router.post(
  "/users/permissions/create",
  gate.can("all-access-permissions"),
  permissionValidation.handler(),
  permissionController.store
);
router.delete("/users/permissions/:id",gate.can("all-access-permissions"), permissionController.destroy);
router.get("/users/permissions/:id/edit",gate.can("all-access-permissions"), permissionController.edit);
router.put(
  "/users/permissions/:id",
  gate.can("all-access-permissions"),
  permissionValidation.handler(),
  permissionController.update
);


// role route
router.get("/users/roles", gate.can("all-access-roles"),roleController.index);
router.get("/users/roles/create",gate.can("all-access-roles"), roleController.create);
router.post(
  "/users/roles/create",
  gate.can("all-access-roles"),
  roleValidation.handler(),
  roleController.store
);
router.delete("/users/roles/:id", gate.can("all-access-roles"),roleController.destroy);
router.get("/users/roles/:id/edit",gate.can("all-access-roles"), roleController.edit);
router.put("/users/roles/:id",gate.can("all-access-roles"), roleValidation.handler(), roleController.update);




// category route
router.get("/categories", gate.can("show-categories"),categoryController.index);
router.get("/categories/create",gate.can("store-categories"), categoryController.create);
router.post(
  "/categories/create",
  gate.can("store-categories"),
  categoryValidation.handler(),
  categoryController.store
);
router.delete("/categories/:id",gate.can("delete-categories"), categoryController.destroy);
router.get("/categories/:id/edit",gate.can("edit-categories"), categoryController.edit);
router.put(
  "/categories/:id",
  gate.can("edit-categories"),
  categoryValidation.handler(),
  categoryController.update
);

router.get("/comments/approved", gate.can("show-approved-comments"),commentController.approved);
router.get("/comments", gate.can("show-comments"),commentController.index);
router.put("/comments/:id/approved",gate.can("show-approved-comments"), commentController.update);
router.delete("/comments/:id",gate.can("delete-comments"), commentController.destroy);

router.post(
  "/upload-image",
  upload.single("upload"),
  adminController.uploadImage
);


// gate.can("edit-user")

router.get("/users", userController.index);
router.get("/users/create",gate.can("store-user"), userController.create);
router.post("/users",gate.can("store-user"), registerValidation.handler(), userController.store);
router.delete("/users/:id", gate.can("delete-users"),userController.destroy);
router.get("/users/:id/toggleadmin",gate.can("change-to-admin-user"), userController.toggleadmin);
router.get("/users/:id/addrole",gate.can("add-role-user"), userController.addrole);
router.put("/users/:id/addrole",gate.can("add-role-user"), userController.storeAddForUser);

module.exports = router;
