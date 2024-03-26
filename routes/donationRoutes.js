const express = require('express');
const router = express.Router();
const controller = require('../controllers/donationController.js');
const auth = require('../auth/auth.js');

//GET ROUTES
router.get('/details/:donationId', auth.verify_member_or_higher, controller.details);
router.get('/accepted_donations_dashboard', auth.verify_admin, controller.accepted_donations);

//POST ROUTES
router.post('/remove_accepted_donation_item/:acceptedDonationId', auth.verify_admin, controller.remove_accepted_donation_item);
router.post('/add_donation_item', auth.verify_admin, controller.add_donation_item);

module.exports = router;