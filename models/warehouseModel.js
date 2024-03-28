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
//seeding warehouse data
async seedData() {
        return new Promise((resolve, reject) => {
            const warehouses = [
                //staffMembers[] will eventually be a list of staff attached to that warehouse - for now its just the manager
                { _id: 'warehouseId1', managerId: 'userId2', location: 'Glasgow', address: '69-71 Aberdalgie Rd, Easterhouse', postcode: 'G34 9HJ', staffMembers:['userId2'], donations: ['donationId1', 'donationId2']},
                { _id: 'warehouseId2', managerId: 'userId3', location: 'Edinburgh', address: '42 John St, Penicuik', postcode: 'EH26 8AB', staffMembers:['userId3'], donations: ['donationId3', 'donationId4']}
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


//adds a stock request form 
addStockRequest(stockRequestData, callback) {
        // Insert the contact data into the database
        return new Promise((resolve, reject) => {
            this.dbManager.db.insert(stockRequestData, (err, newStockRequest) => {
                if (err) {
                    // Handle errors
                    console.error('Error adding stock request:', err);
                    reject(err);
                } else {
                    // No error, invoke the callback with the newly inserted contact
                    resolve(newStockRequest);
                }
            });
        })
    
    }

//a function to return all warehouses from the database by using the address - only users have an address
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

//finds a warehouse based off the managers ID
findByManagerId(managerId) {
    return new Promise((resolve, reject) => {
            this.getAllWarehouses()
                .then(warehouses => {
                    //finding the managers warehouse
                    const warehouse = warehouses.find(warehouse => warehouse.managerId === managerId);
                    
                    //resolving the promise with the warehouse or null
                    resolve(warehouse || null);
                })
                .catch(error => {
                    //return error
                    reject(error);
                });
        });
    }

//returns all stock request forms
getAllStockRequests() {
        return new Promise((resolve, reject) => {
            this.dbManager.db.find({ notes: { $exists: true } }, function(err, stockRequests) {
                if (err) {
                    reject(err);//reject promise
                } else {
                    resolve(stockRequests);//resolve promise
                    console.log('function getAllStockRequests() returns: ', stockRequests);
                }
                
                })
            })
    }

//finds a specific stock request by ID
findStockRequestById(requestId) {
        return new Promise((resolve, reject) => {
            this.dbManager.db.findOne({ _id: requestId, notes: { $exists: true } }, function(err, stockRequest) {
                if (err) {
                    reject(err);//reject promise
                } else {
                    resolve(stockRequest);//resolve promise
                    console.log('function getStockRequestById() returns: ', stockRequest);
                }
                
                })
            })
    }

//updates an existing stock request status 
updateStockRequest(stockRequest) {
        return new Promise((resolve, reject) => {
            this.dbManager.db.update({ _id: stockRequest._id }, { $set: { status: stockRequest.status } }, {}, function(err, stockRequest) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`Updated stock request:`, stockRequest);
                    resolve(); //resolve promise
                }
            });
        });
    }

}
const warehouse = new Warehouse(dbManager);
warehouse.seedData();

module.exports = warehouse;