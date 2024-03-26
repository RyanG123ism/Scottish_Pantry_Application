const express = require('express');
const router = express.Router();
const controller = require('../controllers/warehouseController.js');
const auth = require('../auth/auth.js');

//GET ROUTES
router.get('/view_stock/:warehouseId', auth.verify_manager_or_higher, controller.view_stock);
router.get('/view_all_stock', auth.verify_admin, controller.view_all_stock);
router.get('/view_donations/:warehouseId', auth.verify_manager_or_higher, controller.view_warehouse_donations);
router.get('/view_all_warehouse_donations', auth.verify_admin, controller.view_all_warehouse_donations);
router.get('/create_stock_request/:warehouseId', auth.verify_manager, controller.create_stock_request);
router.get('/view_all_pending_stock_requests', auth.verify_admin, controller.view_all_pending_stock_requests);
router.get('/view_all_approved_stock_requests', auth.verify_admin, controller.view_all_approved_stock_requests);
router.get('/view_all_declined_stock_requests', auth.verify_admin, controller.view_all_declined_stock_requests);


//POST ROUTES
router.post('/post_create_stock_request/:warehouseId', auth.verify_manager, controller.post_create_stock_request);
router.post('/approve_request/:_id', auth.verify_admin, controller.post_approve_request);
router.post('/decline_request/:_id', auth.verify_admin, controller.post_decline_request);


module.exports = router;