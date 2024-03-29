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
    

//seed items that users can donate
seedAcceptedDonationsListData() {
    return new Promise ((resolve, reject) => {
        //seeding a list of accepted donation items - this is just a small example of the list of foods that SCP will be able to accept via donations
        //this is to stop users donating unwanted goods to the system - only items on this list will be able to be donated
        //I would imagine that SCP has a list somewhere of what kind of items they accept but for the purpose of this app im just guessing
        //admins will be able to view and edit this list on the application so that there is scope to add more items and reduce the need for certain donations if need be.       
        const acceptedDonationItems = [
            {acceptedItem: "apples", acceptedItemCategory: "fruit" },
            {acceptedItem: "bananas", acceptedItemCategory: "fruit" },
            {acceptedItem: "oranges", acceptedItemCategory: "fruit" },
            {acceptedItem: "pears", acceptedItemCategory: "fruit" },
            {acceptedItem: "beans", acceptedItemCategory: "tinned goods" },
            {acceptedItem: "carrots", acceptedItemCategory: "veg" },
            {acceptedItem: "potatoes", acceptedItemCategory: "veg" },
            {acceptedItem: "onions", acceptedItemCategory: "veg" },
            {acceptedItem: "garlic", acceptedItemCategory: "veg" },
            {acceptedItem: "rice", acceptedItemCategory: "pantry items" },
            {acceptedItem: "pasta", acceptedItemCategory: "pantry items" },
            {acceptedItem: "tomatoes", acceptedItemCategory: "tinned goods" },        
        ];

        // Array to store promises for each seeding operation
        const promises = [];

        for (const acceptedItemData of acceptedDonationItems) {
            promises.push(new Promise((innerResolve, innerReject) => {
                this.dbManager.db.findOne({ acceptedItem: acceptedItemData.acceptedItem }, (err, existingData) => {
                    if (err) {
                        console.error('Error checking for existing accepted donation item list:', err);
                        innerReject(err);
                        return;
                    }

                    if (!existingData) {
                        this.dbManager.db.insert(acceptedItemData, (insertErr, newDoc) => {
                            if (insertErr) {
                                console.error('Error seeding accepted donation data:', insertErr);
                                innerReject(insertErr);
                                return;
                            }
                            console.log('Accepted Donation List data seeded:', newDoc);
                            innerResolve(newDoc); // Resolve the inner promise
                        });
                    } else {
                        console.log(`accepted donation item: ${acceptedItemData.acceptedItem} already exists and will not be seeded into the DB.`);
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

//seed donation data
seedDonationData() {
    return new Promise((resolve, reject) => {

        //creating a use by date for all seeded donation items
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + 5);

        //create a new date 10 days ago - testing expiry date functions work 
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

        //create a new date 6 days ago - testing expiry date functions work 
        const sixDaysAgo = new Date();
        sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

        const donations = [
            { _id: 'donationId1', userId: 'userId1', warehouseId: 'warehouseId1', foodItem: 'apples', category: 'fruit',  weightKg: 1.2, qty: 1, donatedOn: tenDaysAgo.toISOString().split('T')[0], useByDate: sixDaysAgo.toISOString().split('T')[0]},
            { _id: 'donationId2', userId: 'userId1', warehouseId: 'warehouseId1', foodItem: 'carrots', category: 'veg',  weightKg: 0.8, qty: 1, donatedOn: new Date().toISOString().split('T')[0], useByDate: newDate.toISOString().split('T')[0]},
            { _id: 'donationId3', userId: 'userId2', warehouseId: 'warehouseId2', foodItem: 'beans', category: 'tinned goods',  weightKg: "N/A", qty: 5, donatedOn: new Date().toISOString().split('T')[0], useByDate: newDate.toISOString().split('T')[0]},
            { _id: 'donationId4', userId: 'userId4', warehouseId: 'warehouseId2', foodItem: 'potatoes', category: 'veg',  weightKg: 2.2, qty: 1, donatedOn: new Date().toISOString().split('T')[0], useByDate: newDate.toISOString().split('T')[0]},
            { _id: 'donationId5', userId: 'userId5', warehouseId: 'warehouseId1', foodItem: 'apples', category: 'fruit',  weightKg: 1.2, qty: 1, donatedOn: new Date().toISOString().split('T')[0], useByDate: newDate.toISOString().split('T')[0]},
            { _id: 'donationId6', userId: 'userId6', warehouseId: 'warehouseId1', foodItem: 'carrots', category: 'veg',  weightKg: 0.8, qty: 1, donatedOn: new Date().toISOString().split('T')[0], useByDate: newDate.toISOString().split('T')[0]},
            { _id: 'donationId7', userId: 'userId7', warehouseId: 'warehouseId2', foodItem: 'beans', category: 'tinned goods',  weightKg: "N/A", qty: 6, donatedOn: new Date().toISOString().split('T')[0], useByDate: newDate.toISOString().split('T')[0]},
            { _id: 'donationId8', userId: 'userId8', warehouseId: 'warehouseId2', foodItem: 'potatoes', category: 'veg', weightKg: 2.2, qty: 1, donatedOn: new Date().toISOString().split('T')[0], useByDate: newDate.toISOString().split('T')[0]}
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

//returns all donations
getAllDonations() {
    return new Promise((resolve, reject) => {
        this.dbManager.db.find({ weightKg: { $exists: true } }, function(err, donations) {
            if (err) {
                reject(err);//reject promise
            } else {
                resolve(donations);//resolve promise
                console.log('function getAllDonations() returns: ', donations);
            }
            
            })
        })
}

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
                //filter to include only those with a weight property aka donations
                const filteredDonations = donations.filter(donation => donation.weightKg);
                resolve(filteredDonations); //resolve promise with the filtered donations
            }
        });
    });
}

//finding a unique food item from the accepted donations list 
findAcceptedDonationListItem(acceptedDonationId) {
    return new Promise((resolve, reject) => {
        //finding the acceptedDontaiton object with acceptedDonationId and filtering by acceptedItem
        this.dbManager.db.findOne({ _id: acceptedDonationId, acceptedItem: { $exists: true } }, (err, acceptedDonation) => {
            if (err) {
                reject(err);
            } else {
                resolve(acceptedDonation); //resolve promise
            }
        });
    });
}

//retrieve the accepted donation item list - finds by unique collumn acceptedItem
getAcceptedDonationsList() {
    return new Promise((resolve, reject) => {
        this.dbManager.db.find({ acceptedItem: { $exists: true } }, function(err, acceptedDonationItems) {
            if (err) {
                reject(err);//reject promise
            } else {
                resolve(acceptedDonationItems);//resolve promise
                console.log('function getAcceptedDonationsList() returns: ', acceptedDonationItems);
            }
            
        })
    });
}

//remove's a donation OR accepted donation item from the DB 
remove(id) {
    return new Promise((resolve, reject) => {
        //remove method
        this.dbManager.db.remove({_id: id},{}, function(err,docsRem){
            if(err){
                console.log('error deleting document');
                reject(err);//reject promise
            } else {
                console.log('donation object removed from database: ', docsRem)
                resolve();
            }
        });
    });
}

//adds donation item into the DB - not a donation, and ITEM that can be donated 
addDonationItem(donationItem) {
    return new Promise((resolve, reject) => {
        this.dbManager.db.insert(donationItem, (err, newDonationItem) => {
            if (err) {
                //handle errors
                console.error('Error adding donation item:', err);
                reject(err);
            } else {
                // No error, resolve the promise
                resolve(newDonationItem);
            }
            });
        })
    
    }

//adds donation into the DB  
addDonation(donation) {
    return new Promise((resolve, reject) => {
        this.dbManager.db.insert(donation, (err, newDonation) => {
            if (err) {
                //handle errors
                console.error('Error adding donation item:', err);
                reject(err);
            } else {
                console.log('Donation added: ', newDonation);
                resolve(newDonation);
            }
            });
        })
    
    }
    
}


const donation = new Donation(dbManager);

donation.seedDonationData();
donation.seedAcceptedDonationsListData();

module.exports = donation;