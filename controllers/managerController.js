//importing relevant libraries
const User = require('../models/userModel');
const Donation = require('../models/donationModel');
const Warehouse = require('../models/warehouseModel');

exports.dashboard = async(req, res) => {
    try {
        //finds user using session details
        User.findById(req.sessionDetails.userId, async(err, user) => {
            if (err) {
                console.log("Error looking up user", err);
                return res.status(401).send();
            }
            if (!user) {
                return res.render("error looking up user - does not exist");
            }               
            
            //find the warehouse managed by the current user
            const warehouse = await Warehouse.findByManagerId(user._id);

            //pass that warehouse ID into the mustache template               
            res.render('manager/dashboard', { warehouseId: warehouse._id} )
        });
    } catch (error) {
        console.error('Error processing GET request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }   
}


