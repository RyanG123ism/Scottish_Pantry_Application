const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController.js');
const {login} = require('../auth/auth.js'); //middleware that handles login functions
const {verify} = require('../auth/auth.js'); //middleware that verify's a users authenticated

//GET ROUTES
router.get("/getAllUsers", verify, controller.get_all_users)
router.get("/details", verify, controller.details)

//POST ROUTES


//LOGIN GET ROUTES
router.get("/register", controller.register_page);
router.get("/login", controller.login_page); 
router.get("/logout",verify, controller.logout);

//LOGIN POST ROUTES
router.post("/register", controller.register_new_user); 
router.post("/login", login, controller.handle_login);

module.exports = router;