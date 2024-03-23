const Warehouse = require('../models/warehouseModel');
const Donation = require('../models/donationModel');

// Returns the logged in users details
exports.view_stock = async (req, res) => {
    try {
        // Gets warehouseId from requests params
        const warehouseId = req.params.warehouseId;

        // Retrieve Donations for the Warehouse
        const donations = await Donation.getDonationsForWarehouse(warehouseId);

        // Group Donations by Food Item
        const groupedStock = donations.reduce((acc, donation) => {
            // Group by food item
            if (!acc[donation.foodItem]) {
                acc[donation.foodItem] = {
                    foodItem: donation.foodItem,
                    totalWeight: 0,
                    totalQty: 0,
                    category: donation.category,
                };
            }

            // Update total weight or quantity based on category
            if (donation.category === 'tinned goods' || donation.category === 'boxed goods') {
                acc[donation.foodItem].totalWeight = 'Not Applicable';
                acc[donation.foodItem].totalQty += isNaN(donation.qty) ? 0 : donation.qty;
            } else {
                acc[donation.foodItem].totalWeight += isNaN(donation.weightKg) ? 0 : donation.weightKg;
                acc[donation.foodItem].totalQty = isNaN(acc[donation.foodItem].totalQty) ? 0 : acc[donation.foodItem].totalQty; // Initialize totalQty to 0 if it's not a number
                acc[donation.foodItem].totalQty += isNaN(donation.qty) ? 0 : donation.qty;
            }

            return acc;
        }, {});

        // Convert groupedStock object into array
        const stockList = Object.values(groupedStock);

        // Render Collated List of Stock
        res.render('manager/viewWarehouseStock', { stockList });

    } catch (error) {
        console.error('Error retrieving warehouse details:', error);
        res.status(500).send('Internal Server Error');
    }
}
  