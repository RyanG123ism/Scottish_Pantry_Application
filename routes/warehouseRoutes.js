const express = require('express');
const router = express.Router();
const controller = require('../controllers/warehouseController.js');


//GET ROUTES
router.get('/view_stock/:warehouseId', controller.view_stock);

//POST ROUTES


module.exports = router;