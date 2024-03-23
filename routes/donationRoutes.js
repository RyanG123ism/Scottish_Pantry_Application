const express = require('express');
const router = express.Router();
const controller = require('../controllers/donationController.js');


//GET ROUTES
router.get('/details/:donationId', controller.details);


//POST ROUTES


module.exports = router;