const Donation = require('../models/donationModel');
const Warehouse = require('../models/warehouseModel');

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

exports.make_donation = async(req, res) => {
    try {
        //gets all warehouses to pass to view
        const warehouses = await Warehouse.getAllWarehouses();
        //getting all accepted donation items
        const acceptedDonations = await Donation.getAcceptedDonationsList();
        //rending into view
        res.render('user/makeDonation', {acceptedDonations : acceptedDonations, warehouses : warehouses }) 
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.post_make_donation = async(req, res) => {
    try {

        //gets all warehouses and donation list to pass to view incase error handling is called 
        const warehouses = await Warehouse.getAllWarehouses();
        const acceptedDonations = await Donation.getAcceptedDonationsList();

        //calculating 5 days from today and 2 years from today - for error checking below
        const currentDate = new Date();
        const fiveDaysFromNow = new Date(currentDate);
        fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);

        const twoYearsFromNow = new Date(currentDate);
        fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 730);

        //gets the data from the req.body
        const warehouseId = req.body.address;
        const foodItem = req.body.acceptedItem;
        let qty = req.body.qty;
        let weightKg = req.body.weightKg;
        const useByDate = req.body.useByDate;

        //getting todays date
        const donatedOn = new Date().toISOString().split('T')[0]

        //getting users Id from session
        const userId = req.session.user.id;

        //gets all acceptedItems
        const foodItemData = await Donation.getAcceptedDonationsList()
        //loops through and finds the corresponding item category
        let category = null;
        for (const item of foodItemData) {
            if (item.acceptedItem === foodItem) {
                category = item.acceptedItemCategory;
                break; // Once the matching item is found, exit the loop
            }
        }

        let errorMessage = null;

        //checks if useByDate is today or in the past
        if (new Date(useByDate) <= currentDate) {
            errorMessage = "Use by date must be in the future.";
        }

        //only fruit, veg and meat will be tracked by weight
        //so if the category is one of these - it will automatically revert the QTY to 1
        //all other donations will be measured by QTY - so it will automatically revert weight to N/A
        //error handling also to make sure that the corrects units are donated
        if(category == "fruit" || category == "veg" || category == "meat")
        {
            if(!weightKg || weightKg == 0 || weightKg == "")
            {
                errorMessage = "a weight is required for this item";
            }
            else if(weightKg <= 0 || weightKg > 5)
            {
                errorMessage = "Only donations between 0.1 - 5 kilograms are acceptable";
            }else{
                //setting qty to 1 as this item is measured based on weight. 
                qty = 1;
            }          
        }
        else{
            if(!qty || qty == 0 || qty == "")
            {
                errorMessage = "a qty is required for this item";
            }
            else if(qty <= 0 || qty > 100)
            {
                errorMessage = "Only donations between 1 - 100 quantity are acceptable";
            }
            else{
                //setting weight to NA as these items are measured by quantity
                weightKg = "N/A";
            }          
        }

        //checking dates
        if(category == "tinned goods" || category == "pantry items" || category == "other")
        {
            if(new Date(useByDate) >= twoYearsFromNow)
            {
                errorMessage = "Use by Date must not exceed 2 years for pantry items, tinned goods, or other."
            }
        }
        else{
            if(new Date(useByDate) >= fiveDaysFromNow)
            {
                errorMessage = "Use by Date must not exceed 5 days for fresh produce"
            }
        }

        //if error message was populated then the page will render to display the message
        if (errorMessage) {
            res.render('user/makeDonation', { errorMessage, acceptedDonations, warehouses });
            return;
        }

        //creating donation property and passing to model
        const donation = {userId, warehouseId, foodItem, category, weightKg, qty, donatedOn, useByDate};
        Donation.addDonation(donation);

        //redirect to home page
        res.redirect('/home');
        
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

