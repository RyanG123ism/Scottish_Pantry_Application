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
addContactForm(contactData) {
    return new Promise((resolve, reject) => {
        this.dbManager.db.insert(contactData, (err, newContact) => {
            if (err) {
                //handle errors
                console.error('Error adding contact:', err);
                reject(err);
            } else {
                // No error, resolve the promise
                resolve(newContact);
            }
            });
        })
    
    }

//a function to return all contact forms from the database by using the question variable - only contact Objects have that variable
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

//deletes a contact form - not in use
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

//updates a contact form    
updateContactForm(id) {
        return new Promise((resolve, reject) => {
            // Update the contact form with the given ID
            // Set the contacted property to true
            this.dbManager.db.update({ _id: id, question: { $exists: true } }, { $set: { contacted: true } }, { multi: false }, function(err, numUpdated) {
                if (err) {
                    reject(err);
                } else {
                    resolve(numUpdated); // Resolve with the number of documents updated
                }
            });
        });
    }
}

const contact = new Contact(dbManager);
module.exports = contact;