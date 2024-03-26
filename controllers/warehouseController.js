const Warehouse = require('../models/warehouseModel');
const Donation = require('../models/donationModel');

//function to generate stocklist for ANY or ALL warehouses in the system
const generateWarehouseStockList = async (donations) => {
    
    const groupedStock = donations.reduce((acc, donation) => {
        //groups by food item using accumulator 
        if (!acc[donation.foodItem]) {
            acc[donation.foodItem] = {
                foodItem: donation.foodItem,
                //total values for weight and qty 
                totalWeight: 0,
                totalQty: 0,
                category: donation.category, // colates all the catagories together to display as one
            };
        }

        //if item is canned or boxed - remove weight variable
        //if not - remove QTY variable
        if (donation.category === 'tinned goods' || donation.category === 'boxed goods') {
            acc[donation.foodItem].totalWeight = 'Not Applicable';
            acc[donation.foodItem].totalQty += isNaN(donation.qty) ? 0 : donation.qty;
        } else {
            acc[donation.foodItem].totalWeight += isNaN(donation.weightKg) ? 0 : donation.weightKg;
            acc[donation.foodItem].totalQty = isNaN(acc[donation.foodItem].totalQty) ? 0 : acc[donation.foodItem].totalQty; //Initialize totalQty to 0 if it's not a number
            acc[donation.foodItem].totalQty += isNaN(donation.qty) ? 0 : donation.qty;
        }

        return acc;
    }, {});

    // Convert groupedStock object into array
    const stockList = Object.values(groupedStock);

    return stockList;
};

//function to generate stock list for ANY or ALL warehouses in the system
const generateAllFoodItemsList = async () => {
    
    //gets all donations - use this to find all unique foodItems
    const donations = await Donation.getAllDonations();

    const uniqueFoodItems = donations.reduce((acc, donation) => {
        //returns a list of all unique foodItems  
        if (!acc[donation.foodItem]) {
            acc[donation.foodItem] = {
                foodItem: donation.foodItem,
            };
        }
        return acc;
    }, {});

    // Convert groupedStock object into array
    const stockList = Object.values(uniqueFoodItems);

    return stockList;
};


//returns a stock list for ONE warehouse
exports.view_stock = async (req, res) => {
    try {
        //gets warehouse id from request params
        const warehouseId = req.params.warehouseId;

        //gets all donations made to that warehouse
        const donations = await Donation.getDonationsForWarehouse(warehouseId);
            
        //calculates stock list for specific warehouse
        const stockList = await generateWarehouseStockList(donations)

        // Render Collated List of Stock
        res.render('manager/viewWarehouseStock', { stockList });

    } catch (error) {
        console.error('Error retrieving warehouse details:', error);
        res.status(500).send('Internal Server Error');
    }
}
  

//returns a stock list for ALL the stock on the system
exports.view_all_stock = async (req, res) => {
    try {
        //gets all donations made to that warehouse
        const donations = await Donation.getAllDonations();
            
        //calculates stock list for specific warehouse
        const stockList = await generateWarehouseStockList(donations)

        // Render Collated List of Stock
        res.render('manager/viewWarehouseStock', { stockList });

    } catch (error) {
        console.error('Error retrieving warehouse details:', error);
        res.status(500).send('Internal Server Error');
    }
}

//returns a list of ALL donations made to ALL warehouses
exports.view_all_warehouse_donations = async (req, res) => {
    
    try {
        //gets all donations made to that warehouse
        const donations = await Donation.getAllDonations();
        console.log("warehouse donations:", donations);
        
        // Render Collated List of Stock
        res.render('manager/viewDonations', { donations });

    } catch (error) {
        console.error('Error retrieving donation details:', error);
        res.status(500).send('Internal Server Error');
    }
    
}

//returns a list of donations made to ONE warehouse only
exports.view_warehouse_donations = async (req, res) => {
    try{
        //gets warehouse id from request params
        const warehouseId = req.params.warehouseId;

        const donations = await Donation.getDonationsForWarehouse(warehouseId);
        console.log('view_warehouse_donations donations:' , donations);
        res.render('manager/viewDonations', {donations} );
    }catch(err){
        console.error('Error retrieving donation details:', error);
        res.status(500).send('Internal Server Error');   
    }
    
    
}

// Handle form submission for contact forms
exports.create_stock_request = async (req, res) => {

    //gets warehouse Id from req.params and the form data from the req.body
    const warehouseId = req.params.warehouseId; 

    //gets all foodItems from all warehouses and passes it to the view
    //this means managers can only request stock that is in the system elsewhere - even though they cannot see other warehouse stock lists
    const stockList = await generateAllFoodItemsList();

    res.render('manager/stockRequestForm', {stockList: stockList, warehouseId: warehouseId});
};

// Handle form submission for contact forms
exports.post_create_stock_request = async (req, res) => {

    //gets warehouse Id from req.params and the form data from the req.body
    const warehouseId = req.params.warehouseId;    
    const { foodItem, notes } = req.body;
    const status = "pending";//setting status to pending for every new request 
    const requestedOn = new Date().toISOString().split('T')[0];

    //creates a new stockRequest variable with all the form data including the warehouse ID
    const stockRequest = {warehouseId, foodItem, notes, requestedOn, status};

    const newStockRequest = await Warehouse.addStockRequest(stockRequest);

    if(!newStockRequest)
    {
        console.log('Error saving stock request');
        res.render('Error saving stock request');
    }
    else
    {
        console.log('Stock Request Submitted:' , newStockRequest);
        //redirect back to manager dashboard
        res.redirect('/manager/dashboard');
    }
};
  
//view all stock requests with "pending" status
exports.view_all_pending_stock_requests = async (req, res) => {
    try {
        const stockRequests = await Warehouse.getAllStockRequests();

        if (!stockRequests) {
            console.log('Error finding stock requests');
            res.render('Error finding stock requests');
        } else {           
            //filter stock requests to get only pending requests
            const pendingRequests = stockRequests.filter(request => request.status === "pending");
            //render the view
            res.render('admin/viewAllPendingStockRequests', { stockRequests: pendingRequests });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//view all stock requests with "pending" status
exports.view_all_approved_stock_requests = async (req, res) => {
    try {
        const stockRequests = await Warehouse.getAllStockRequests();

        if (!stockRequests) {
            console.log('Error finding stock requests');
            res.render('Error finding stock requests');
        } else {           
            //filter stock requests to get only pending requests
            const pendingRequests = stockRequests.filter(request => request.status === "approved");
            //render the view
            res.render('admin/viewDeclinedOrApprovedStockRequests', { stockRequests: pendingRequests });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//view all stock requests with "pending" status
exports.view_all_declined_stock_requests = async (req, res) => {
    try {
        const stockRequests = await Warehouse.getAllStockRequests();

        if (!stockRequests) {
            console.log('Error finding stock requests');
            res.render('Error finding stock requests');
        } else {           
            //filter stock requests to get only pending requests
            const pendingRequests = stockRequests.filter(request => request.status === "declined");
            //render the view
            res.render('admin/viewDeclinedOrApprovedStockRequests', { stockRequests: pendingRequests });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//updates stock request status to approved
exports.post_approve_request = async (req, res) => {
    try {
        //gets the stock request id from the req params
        const stockRequestId = req.params._id;
        const stockRequest = await Warehouse.findStockRequestById(stockRequestId);
        //set status to approved
        stockRequest.status = "approved";
        //update request 
        await Warehouse.updateStockRequest(stockRequest);

        //update current page
        res.redirect('/warehouse/view_all_pending_stock_requests');

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//updates stock request status to approved
exports.post_decline_request = async (req, res) => {
    try {
        //gets the stock request id from the req params
        const stockRequestId = req.params._id;
        const stockRequest = await Warehouse.findStockRequestById(stockRequestId);
        //set status to approved
        stockRequest.status = "declined";
        //update request 
        await Warehouse.updateStockRequest(stockRequest);

        //update current page
        res.redirect('/warehouse/view_all_pending_stock_requests');

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};