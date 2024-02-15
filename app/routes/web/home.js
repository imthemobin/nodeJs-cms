const express = require("express");
const router = express.Router();

//controllers
const homeController = require('app/http/controllers/homeController')


//Home Router
router.get("/", homeController.index);

module.exports = router;
