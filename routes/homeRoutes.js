const express = require('express');
const router = express.Router();
const controller = require('../controllers/homeController.js');
const {verify} = require('../auth/auth.js'); //middleware that verify's a users authenticated

//GET ROUTES
router.get("/", controller.landing_page);//----- this is the starting point of the application
router.get('/about', controller.about_page);
router.get('/contact', controller.contact_page);
router.get('/home', controller.home);

//POST ROUTES
router.post("/", controller.home);//----- this is the starting point of the application



module.exports = router;