const express = require('express');
const router = express.Router();
const controller = require('../controllers/homeController.js');
const auth = require('../auth/auth.js');

//GET ROUTES
router.get("/", controller.landing_page);//----- this is the starting point of the application
router.get('/about', controller.about_page);
router.get('/contact', controller.contact_page);
router.get('/home', controller.home);

//POST ROUTES
router.post("/", controller.home);



module.exports = router;