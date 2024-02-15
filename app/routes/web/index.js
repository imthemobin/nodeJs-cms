const express = require("express");
const router = express.Router();

// Home Router
const homeRouter = require("app/routes/web/home");
router.use("/", homeRouter);

// Admin Router
const adminRouter = require("app/routes/web/admin");
router.use("/admin", adminRouter);

module.exports = router;
