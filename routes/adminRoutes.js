const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController.js');


//GET ROUTES
router.get("/dashboard", controller.dashboard);
router.get("/user_dashboard", controller.user_dashboard);
router.get("/stock_dashboard", controller.stock_dashboard);
router.get("/donation_dashboard", controller.donation_dashboard);
router.get('/user_details/:userId', controller.user_details);

//POST ROUTES


module.exports = router;