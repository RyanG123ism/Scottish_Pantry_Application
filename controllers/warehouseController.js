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


//returns a stock list for one warehouse
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
  

//returns a stock list for all the stock on the system
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

//returns a stock list for all the stock on the system
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

//returns a stock list for all the stock on the system
exports.view_warehouse_donations = async (req, res) => {
    try{
        //gets warehouse id from request params
        const warehouseId = req.params.warehouseId;
        console.log("warehouse id:", warehouseId);

        const donations = await Donation.getDonationsForWarehouse(warehouseId);
        console.log("warehouse donations:", donations);

        res.render('manager/viewDonations', {donations} );
    }catch(err){
        console.error('Error retrieving donation details:', error);
        res.status(500).send('Internal Server Error');   
    }
    
    
}
  