const express = require('express');
const router = express.Router();
const controller = require('../controllers/warehouseController.js');


//GET ROUTES
router.get('/view_stock/:warehouseId', controller.view_stock);
router.get('/view_all_stock', controller.view_all_stock);
router.get('/view_donations/:warehouseId', controller.view_warehouse_donations)
router.get('/view_all_warehouse_donations', controller.view_all_warehouse_donations)

//POST ROUTES


module.exports = router;