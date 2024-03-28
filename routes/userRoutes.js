const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController.js');
const auth = require('../auth/auth.js');


//GET ROUTES
router.get("/details", auth.verify_logged_in, controller.details);
router.get("/details/:userId", auth.verify_logged_in, controller.details);
router.get("/edit_as_admin/:userId", auth.verify_admin, controller.edit);
router.get("/update_status/:userId", auth.verify_admin, controller.update_status);
router.get("/create_user", auth.verify_admin, controller.create_user);

//POST ROUTES
router.post("/edit/:userId", auth.verify_admin, controller.post_edit);
router.post("/create_user", auth.verify_admin, controller.post_create_user);

//LOGIN GET ROUTES
router.get("/register", controller.register_page);
router.get("/login", controller.login_page); 
router.get("/logout",auth.verify_logged_in, controller.logout);

//LOGIN POST ROUTES
router.post("/register", controller.register_new_user); 
router.post("/login", auth.login, controller.handle_login);

module.exports = router;