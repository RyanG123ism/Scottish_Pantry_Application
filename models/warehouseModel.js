//importing database 
const dbManager = require('../data/databaseManager');

class Warehouse {

    constructor(dbManager) {
        if (dbManager) {
            this.dbManager = dbManager;
            console.log('DB connected.... warehouse model');
        } else {
            throw new Error('A NeDB instance must be provided.');
        }
    }  

    async seedData() {
        return new Promise((resolve, reject) => {
            const warehouses = [
                { _id: 'warehouseId1', location: 'Glasgow', address: '69-71 Aberdalgie Rd, Easterhouse', postcode: 'G34 9HJ', staffMembers:[], donations: ['donationId1', 'donationId2']},
                { _id: 'warehouseId2', location: 'Edinburgh', address: '42 John St, Penicuik', postcode: 'EH26 8AB', staffMembers:[], donations: ['donationId3', 'donationId4']}
            ]
    
            // Array to store promises for each seeding operation
            const promises = [];
    
            for (const warehouseData of warehouses) {
                promises.push(new Promise((innerResolve, innerReject) => {
                    this.dbManager.db.findOne({ _id: warehouseData._id }, (err, existingWarehouse) => {
                        if (err) {
                            console.error('Error checking for existing warehouse:', err);
                            innerReject(err);
                            return;
                        }
    
                        if (!existingWarehouse) {
                            this.dbManager.db.insert(warehouseData, (insertErr, newDoc) => {
                                if (insertErr) {
                                    console.error('Error seeding warehouse data:', insertErr);
                                    innerReject(insertErr);
                                    return;
                                }
                                console.log('warehouse data seeded:', newDoc);
                                innerResolve(newDoc); // Resolve the inner promise
                            });
                        } else {
                            console.log(`warehouse with the ID ${warehouseData._id} already exists and will not be seeded into the DB.`);
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


    //a function to return all users from the database by using the email - only users have an email
    getAllWarehouses() {
        return new Promise((resolve, reject) => {
            this.dbManager.db.find({ address: { $exists: true } }, function(err, warehouses) {
                if (err) {
                    reject(err);//reject promise
                } else {
                    resolve(warehouses);//resolve promise
                    console.log('function getAllWarehouses() returns: ', warehouses);
                }
                
                })
            })
    }

}
const warehouse = new Warehouse(dbManager);

warehouse.seedData();

module.exports = warehouse;