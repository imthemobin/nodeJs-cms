const express = require("express");
const router = express.Router();

//controllers
const homeController = require('app/http/controllers/homeController')
const loginController = require('app/http/controllers/auth/loginController');
const registerController = require('app/http/controllers/auth/registerController');


//Home Router
router.get("/", homeController.index);
router.get('/login' , loginController.showLoginForm);
router.get('/register' , registerController.showRegsitrationForm);
router.post('/register' , registerController.registerProcess);

module.exports = router;
