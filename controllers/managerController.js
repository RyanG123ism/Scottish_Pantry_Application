//importing relevant libraries
const User = require('../models/userModel');
const Donation = require('../models/donationModel');
const Warehouse = require('../models/warehouseModel');

exports.dashboard = async(req, res) => {
    try {
        
        //get logged in managers ID from session
        //loop through warehouses
        //find warehouse that has managers ID attached
        //pass that ID into the mustache template
                
        res.render('manager/dashboard', { warehouseId: warehouseId} )
    } catch (error) {
        console.error('Error processing GET request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }   
}


