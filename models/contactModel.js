//importing database 
const dbManager = require('../data/databaseManager');

class Contact {

    constructor(dbManager) {
        if (dbManager) {
            this.dbManager = dbManager;
            console.log('DB connected to.... contact model');
        } else {
            throw new Error('A NeDB instance must be provided.');
        }
    }  


//adds a contact form into the DB 
addContactForm(contactData, callback) {
    // Insert the contact data into the database
    return new Promise((resolve, reject) => {
        this.dbManager.db.insert(contactData, (err, newContact) => {
            if (err) {
                // Handle errors
                console.error('Error adding contact:', err);
                callback(err);
            } else {
                // No error, invoke the callback with the newly inserted contact
                callback(null, newContact);
            }
            });
        })
    
    }

//a function to return all users from the database by using the question variable - only contact Objects have that variable
getAllContactForms() {
    return new Promise((resolve, reject) => {
        this.dbManager.db.find({ question: { $exists: true } }, function(err, contactForms) {
            if (err) {
                reject(err);//reject promise
            } else {
                resolve(contactForms);//resolve promise
                console.log('function getAllCOntactForms() returns: ', contactForms);
            }
            });
        })
    }

deleteContactForm(id) {
    return new Promise((resolve, reject) => {
        //finds the contact form with the given ID
        //using the quesiton feild to make sure that the object is a contact form
        this.dbManager.db.remove({ _id: id, question: { $exists: true } }, { multi: false }, function(err, numRemoved) {
            if (err) {
                reject(err);
            } else {
                resolve(numRemoved); // Resolve with the number of documents removed
            }
        });
    });
    }
}



const contact = new Contact(dbManager);
module.exports = contact;