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

//returns a list of all the accepted donation items that are monitored by the admin
exports.accepted_donations = async(req, res) => {
    try{
        //getting all accepted donation items
        const acceptedDonations = await Donation.getAcceptedDonationsList();
        //rending into view
        res.render('admin/acceptedDonationList', {acceptedDonations : acceptedDonations }) 

    }catch(error){
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    

}

//removes a donation item from the accepted donation items list 
exports.remove_accepted_donation_item = async(req, res) => {
    try {
        //gets the acceptedDonation item ID via req params and finds object with ID
        const acceptedDonationId = req.params.acceptedDonationId;
        const acceptedDonation = await Donation.findAcceptedDonationListItem(acceptedDonationId);
        
        if(!acceptedDonation)
        {
            console.log('Could not Find Accepted Donation Item');
            res.status(404);
        }

        //deletes item form the list - TO DO 
        await Donation.remove(acceptedDonation._id);

        //update current page
        res.redirect('/donation/accepted_donations_dashboard');

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//adds a new item to the accepted donations items list 
exports.add_donation_item = async(req, res) => {
    try{
        const { acceptedItem, acceptedItemCategory } = req.body;//getting data from request
        const donationItem = { acceptedItem, acceptedItemCategory };

        //gets all donationItems currently on the list
        const acceptedDonations = await Donation.getAcceptedDonationsList();

        //loop through acceptedDonations and IF foodItem matches donationItem.foodItem then return error - food item already exists in the item list 
        const existingItem = acceptedDonations.find(item => item.acceptedItem === acceptedItem);
        if (existingItem) {
            // Food item already exists, return an error
            return res.status(400).send('Error: Food item already exists in the accepted donations list.');
        }

        //add to list 
        Donation.addDonationItem(donationItem);

        //update current page
        res.redirect('/donation/accepted_donations_dashboard');

    }catch(error){
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

