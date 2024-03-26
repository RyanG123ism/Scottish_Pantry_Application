const express = require('express');
const router = express.Router();
const controller = require('../controllers/managerController.js');
const auth = require('../auth/auth.js');

//GET ROUTES
router.get("/dashboard", auth.verify_manager, controller.dashboard);

//POST ROUTES


module.exports = router;