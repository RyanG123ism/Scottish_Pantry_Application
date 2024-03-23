const Donation = require('../models/donationModel');

exports.details = async(req, res) => {
    try {
        //gets userId from req params and uses it to find user
        const donationId = req.params.donationId;         
            // Once user is found, retrieve donations for the user
            Donation.getDonationById(donationId, function (err, donation) {
                if (err) {
                    console.log("Error looking up donations", err);
                    return res.status(401).send();
                }
                if (!donation) {
                    return res.render("error looking up donation - does not exist");
                }

                // Render the view with user and donations data
                res.render('donation/details', {donation: donation });
            });
       
    } catch (error) {
        console.error('Error retrieving user details:', error);
        res.status(500).send('Internal Server Error');
    }
}