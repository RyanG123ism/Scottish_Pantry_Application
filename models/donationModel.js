const dbManager = require('../data/databaseManager');

class Donation {
    constructor(dbManager) {
        if (dbManager) {
            this.dbManager = dbManager;
            console.log('DB connected.... donation model');
        } else {
            throw new Error('A NeDB instance must be provided.');
        }
    } 
    

seedData() {
    return new Promise((resolve, reject) => {
        const donations = [
            { _id: 'donationId1', userId: 'userId1', warehouseId: 'warehouseId1', foodItem: 'apples', category: 'fruit', price: 5.99, weightKg: 1.2, qty: 1, donatedOn: new Date().toISOString().split('T')[0]},
            { _id: 'donationId2', userId: 'userId1', warehouseId: 'warehouseId1', foodItem: 'carrots', category: 'veg', price: 3.00, weightKg: 0.8, qty: 1, donatedOn: new Date().toISOString().split('T')[0]},
            { _id: 'donationId3', userId: 'userId2', warehouseId: 'warehouseId2', foodItem: 'beans', category: 'tinned goods', price: 2.00, weightKg: NaN, qty: 5, donatedOn: new Date().toISOString().split('T')[0]},
            { _id: 'donationId4', userId: 'userId4', warehouseId: 'warehouseId2', foodItem: 'potatoes', category: 'veg', price: 3.00, weightKg: 2.2, qty: 1, donatedOn: new Date().toISOString().split('T')[0]},
            { _id: 'donationId5', userId: 'userId5', warehouseId: 'warehouseId1', foodItem: 'apples', category: 'fruit', price: 5.99, weightKg: 1.2, qty: 1, donatedOn: new Date().toISOString().split('T')[0]},
            { _id: 'donationId6', userId: 'userId6', warehouseId: 'warehouseId1', foodItem: 'carrots', category: 'veg', price: 3.00, weightKg: 0.8, qty: 1, donatedOn: new Date().toISOString().split('T')[0]},
            { _id: 'donationId7', userId: 'userId7', warehouseId: 'warehouseId2', foodItem: 'beans', category: 'tinned goods', price: 2.00, weightKg: NaN, qty: 5, donatedOn: new Date().toISOString().split('T')[0]},
            { _id: 'donationId8', userId: 'userId8', warehouseId: 'warehouseId2', foodItem: 'potatoes', category: 'veg', price: 3.00, weightKg: 2.2, qty: 1, donatedOn: new Date().toISOString().split('T')[0]},
        ];

        // Array to store promises for each seeding operation
        const promises = [];

        for (const donationData of donations) {
            promises.push(new Promise((innerResolve, innerReject) => {
                this.dbManager.db.findOne({ _id: donationData._id }, (err, existingDonation) => {
                    if (err) {
                        console.error('Error checking for existing donation:', err);
                        innerReject(err);
                        return;
                    }

                    if (!existingDonation) {
                        this.dbManager.db.insert(donationData, (insertErr, newDoc) => {
                            if (insertErr) {
                                console.error('Error seeding donation data:', insertErr);
                                innerReject(insertErr);
                                return;
                            }
                            console.log('Donation data seeded:', newDoc);
                            innerResolve(newDoc); // Resolve the inner promise
                        });
                    } else {
                        console.log(`Donation with the ID ${donationData._id} already exists and will not be seeded into the DB.`);
                        innerResolve(); // Resolve the inner promise
                    }
                });
            }));
        }

        // Resolve the outer promise once all inner promises are resolved
        Promise.all(promises)
            .then(() => {
                resolve('Donation data seeding completed');
            })
            .catch((error) => {
                reject(error);
            });
    });
}

//gets all a users dontations based on user ID
getUsersDonations(userId, cb) {
    this.dbManager.db.find({ userId: userId }, (err, donations) => {
        if (err) {
            cb(err, null);
        } else {
            cb(null, donations);
        }
    });
};

//finds ONE donation based on ID
getDonationById(donationId, cb) {
    this.dbManager.db.findOne({ _id: donationId }, (err, donation) => {
        if (err) {
            cb(err, null);
        } else {
            cb(null, donation);
        }
    });
};

//retrieve donations for a specific warehouse ID
getDonationsForWarehouse(warehouseId) {
    return new Promise((resolve, reject) => {
        // Construct the query object to find donations for the specified warehouse
        const query = {
            warehouseId: warehouseId
        };

        //finding all objects with warehouseId
        this.dbManager.db.find(query, (err, donations) => {
            if (err) {
                reject(err);
            } else {
                //filter to include only those with a foodItem property aka donations
                const filteredDonations = donations.filter(donation => donation.foodItem);
                resolve(filteredDonations); //resolve promise with the filtered donations
            }
        });
    });
}


}

const donation = new Donation(dbManager);

donation.seedData();

module.exports = donation;