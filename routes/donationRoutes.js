const express = require('express');
const router = express.Router();
const controller = require('../controllers/donationController.js');
const auth = require('../auth/auth.js');

//GET ROUTES
router.get('/details/:donationId', auth.verify_member_or_higher, controller.details);
router.get('/accepted_donations_dashboard', auth.verify_admin, controller.accepted_donations);
router.get("/make_donation", auth.verify_member, controller.make_donation);

//POST ROUTES
router.post('/remove_accepted_donation_item/:acceptedDonationId', auth.verify_admin, controller.remove_accepted_donation_item);
router.post('/add_donation_item', auth.verify_admin, controller.add_donation_item);
router.post("/make_donation", auth.verify_member, controller.post_make_donation);

module.exports = router;