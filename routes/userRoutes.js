const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController.js');
const auth = require('../auth/auth.js');


//GET ROUTES
router.get("/details", auth.verify_logged_in, controller.details)

//POST ROUTES


//LOGIN GET ROUTES
router.get("/register", controller.register_page);
router.get("/login", controller.login_page); 
router.get("/logout",auth.verify_logged_in, controller.logout);

//LOGIN POST ROUTES
router.post("/register", controller.register_new_user); 
router.post("/login", auth.login, controller.handle_login);

module.exports = router;