//importing relevant libraries
const User = require('../models/userModel');
const Donation = require('../models/donationModel');
const Warehouse = require('../models/warehouseModel');

//returns admin dashboard view
exports.dashboard = async(req, res) => {
    res.render('admin/dashboard')
}

//returns all users in the DB 
exports.user_dashboard = async(req, res) => {
    try {
        // Query the database for seeded data (adjust the querying logic based on your data structure)
        const users = await User.getAllUsers()
        // Render the data
        res.render("admin/allUsers", {users: users});
    } catch (error) {
        console.error('Error processing GET request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//returns all warehouses in the DB 
exports.stock_dashboard = async(req, res) => {
    try {
        const warehouses = await Warehouse.getAllWarehouses();
        console.log("warehouse list returns: ", warehouses)
        res.render('admin/stockDashboard', { warehouses: warehouses} )
    } catch (error) {
        console.error('Error processing GET request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
}

//returns all donations in the DB
exports.donation_dashboard = async(req, res) => {
    
}

//returns a specific users details
exports.user_details = async(req, res) => {
    try {
        //gets userId from req params and uses it to find user
        const userId = req.params.userId; 
        User.findById(userId, function (err, user) {
            if (err) {
                console.log("Error looking up user", err);
                return res.status(401).send();
            }
            if (!user) {
                return res.render("error looking up user - does not exist");
            }

            // Once user is found, retrieve donations for the user
            Donation.getUsersDonations(userId, function (err, donations) {
                if (err) {
                    console.log("Error looking up donations", err);
                    return res.status(401).send();
                }
                if (!donations) {
                    return res.render("error looking up donation - does not exist");
                }

                // Render the view with user and donations data
                res.render('user/details', { user: user, donations: donations });
            });
        });
    } catch (error) {
        console.error('Error retrieving user details:', error);
        res.status(500).send('Internal Server Error');
    }
}