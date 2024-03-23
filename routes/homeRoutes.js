const express = require('express');
const router = express.Router();
const controller = require('../controllers/homeController.js');

//GET ROUTES
router.get("/", controller.landing_page);//----- this is the starting point of the application
router.get('/about', controller.about_page);
router.get('/contact', controller.contact_page);
router.get('/home', controller.landing_page);

//POST ROUTES
router.post("/", controller.landing_page);//----- this is the starting point of the application


module.exports = router;