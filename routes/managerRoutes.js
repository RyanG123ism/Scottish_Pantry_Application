const express = require('express');
const router = express.Router();
const controller = require('../controllers/managerController.js');

//GET ROUTES
router.get("/dashboard", controller.dashboard);

//POST ROUTES


module.exports = router;