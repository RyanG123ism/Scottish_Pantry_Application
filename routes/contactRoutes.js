const express = require('express');
const router = express.Router();
const controller = require('../controllers/contactController.js');
const auth = require('../auth/auth.js');

//GET ROUTES
router.get("/view_all_contact_forms", auth.verify_manager_or_higher, controller.view_all_contact_forms);

//POST ROUTES
router.post('/submit_contact_form', controller.submit_contact_form);
router.post("/delete_contact_form", controller.delete_contact_form);



module.exports = router;