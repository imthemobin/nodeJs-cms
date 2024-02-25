const express = require("express");
const router = express.Router();

//Middlewares
const redirectIfAuthenticated = require("app/http/middlewares/redirectIfAuthenticated");
const redirectIfNotAdmin = require("app/http/middlewares/redirectIfNotAdmin");
const errorHandler = require("app/http/middlewares/errorHandler");

// Home Router
const homeRouter = require("app/routes/web/home");
router.use("/", homeRouter);

// Admin Router
const adminRouter = require("app/routes/web/admin");
router.use("/admin", redirectIfNotAdmin.handler, adminRouter);

//auth Router
const authRouter = require("app/routes/web/auth");
router.use("/", redirectIfAuthenticated.handler, authRouter);


// handle error
router.all("*", errorHandler.error404);
router.use(errorHandler.handler);

module.exports = router;
