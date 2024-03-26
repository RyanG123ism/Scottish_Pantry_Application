const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController.js');
const auth = require('../auth/auth.js');


//GET ROUTES
router.get("/dashboard", auth.verify_admin, controller.dashboard);
router.get("/user_dashboard", auth.verify_admin, controller.user_dashboard);
router.get("/stock_dashboard", auth.verify_admin, controller.stock_dashboard);
router.get("/donations_dashboard", auth.verify_admin, controller.donations_dashboard);
router.get('/user_details/:userId', auth.verify_admin, controller.user_details);

//POST ROUTES


module.exports = router;