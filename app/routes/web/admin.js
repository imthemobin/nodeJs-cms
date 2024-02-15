const express = require("express");
const router = express.Router();

//controller
const adminController = require("app/http/controllers/admin/adminController");

//Admin Router
router.get("/", adminController.index);
router.get("/course", adminController.courses);

module.exports = router;
