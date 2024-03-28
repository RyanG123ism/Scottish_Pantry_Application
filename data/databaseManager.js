//importing relevant libraries
const nedb = require('nedb');

//class for configuring the database
class DatabaseManager {
    constructor(dbFilePath) {
    
        if (dbFilePath) {
            this.db = new nedb({ 
                filename: dbFilePath, 
                autoload: true             
            });
            console.log('DB connected to ' + dbFilePath);
        } else {
            this.db = new nedb();
        }      
        
    }

    //multiple seeding objects - not using due to circular dependencies error - seeding is manually called through model files at the moment
    async seedDatabase() {
        console.log('seeding database....');
        
        try {
            //Call the user data seeding method
            const userSeededPromise = User.seedData(this.db);
            const donationSeededPromise = Donation.seedData(this.db);
            const warehouseSeededPromise = Warehouse.seedData(this.db);

    
            // Wait for both promises to resolve
            const [userSeeded, donationSeeded, warehouseSeededed] = await Promise.all([userSeededPromise, donationSeededPromise, warehouseSeededPromise]);
    
            //printing seeded data to the console
            console.log('Database seeded:', { userSeeded, donationSeeded, warehouseSeededed });
        } catch (error) {
            console.error('Error seeding database:', error);
        }
    }

}

//initialising an instance of the DB that other files can export 
const dbFilePath = ('../data/scottishPantry.db');
const dbManager = new DatabaseManager(dbFilePath);
//dbManager.seedDatabase();
module.exports = dbManager;