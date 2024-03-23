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
    

static seedData() {
    return new Promise((resolve, reject) => {
        const donations = [
            { _id: 'donationId1', userId: 'userId1', warehouseId: 'warehouseId1', foodItem: 'apples', category: 'fruit', price: 5.99, weightKg: 1.2, qty: 1, donatedOn: new Date().toISOString().split('T')[0]},
            { _id: 'donationId2', userId: 'userId1', warehouseId: 'warehouseId1', foodItem: 'carrots', category: 'veg', price: 3.00, weightKg: 0.8, qty: 1, donatedOn: new Date().toISOString().split('T')[0]},
            { _id: 'donationId3', userId: 'userId2', warehouseId: 'warehouseId2', foodItem: 'beans', category: 'tinned goods', price: 2.00, weightKg: NaN, qty: 5, donatedOn: new Date().toISOString().split('T')[0]},
            { _id: 'donationId4', userId: 'userId4', warehouseId: 'warehouseId2', foodItem: 'potatoes', category: 'veg', price: 3.00, weightKg: 2.2, qty: 1, donatedOn: new Date().toISOString().split('T')[0]},
        ];

        // Array to store promises for each seeding operation
        const promises = [];

        for (const donationData of donations) {
            promises.push(new Promise((innerResolve, innerReject) => {
                db.findOne({ _id: donationData._id }, (err, existingDonation) => {
                    if (err) {
                        console.error('Error checking for existing donation:', err);
                        innerReject(err);
                        return;
                    }

                    if (!existingDonation) {
                        db.insert(donationData, (insertErr, newDoc) => {
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

}

const donation = new Donation(dbManager);

//donation.seedData();//change this.db to this.dbmanager.db, implement db methods

module.exports = donation;