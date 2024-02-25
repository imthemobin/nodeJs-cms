const express = require("express");
const router = express.Router();

//Middlewares
const redirectIfAuthenticated = require("app/http/middlewares/redirectIfAuthenticated");
const redirectIfNotAdmin = require("app/http/middlewares/redirectIfNotAdmin");

// Home Router
const homeRouter = require("app/routes/web/home");
router.use("/", homeRouter);

// Admin Router
const adminRouter = require("app/routes/web/admin");
router.use("/admin", redirectIfNotAdmin.handler, adminRouter);

//auth Router
const authRouter = require("app/routes/web/auth");
router.use("/", redirectIfAuthenticated.handler, authRouter);

module.exports = router;
