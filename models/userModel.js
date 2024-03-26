//importing relevant libraries
const bcrypt = require('bcrypt');
const dbManager = require('../data/databaseManager');

//user class
class User {  
    constructor(dbManager) {
        if (dbManager) {
            this.dbManager = dbManager;
            console.log('DB connected.... user model');
        } else {
            throw new Error('A NeDB instance must be provided.');
        }
    }  

    async seedData() {
        return new Promise((resolve, reject) => {
                    
            const users = [
            { _id: 'userId1',  email: 'ryang123@gmail.com', password: 'password', passwordHash: '$2b$10$AT8oh2C2JW6.B9qmi7UrEuQQwegVB91M2xszlQtO9kh.lZAt0wxse', firstName: 'ryan', lastName: 'grant', donations: [], role: "admin" },
            { _id: 'userId2',  email: 'johndoe456@gmail.com', password: 'password', passwordHash: '$2b$10$AT8oh2C2JW6.B9qmi7UrEuQQwegVB91M2xszlQtO9kh.lZAt0wxse', firstName: 'john', lastName: 'doe', donations: [], role: "manager"},
            { _id: 'userId3', email: 'susan92@yahoo.com', password: 'password', passwordHash: '$2b$10$AT8oh2C2JW6.B9qmi7UrEuQQwegVB91M2xszlQtO9kh.lZAt0wxse', firstName: 'susan', lastName: 'smith', donations: [] , role: "manager" },
            { _id: 'userId4',  email: 'mike34@hotmail.com', password: 'password', passwordHash: '$2b$10$AT8oh2C2JW6.B9qmi7UrEuQQwegVB91M2xszlQtO9kh.lZAt0wxse', firstName: 'mike', lastName: 'johnson', donations: [], role: "member"  },
            { _id: 'userId5',  email: 'amy.white@gmail.com', password: 'password', passwordHash: '$2b$10$AT8oh2C2JW6.B9qmi7UrEuQQwegVB91M2xszlQtO9kh.lZAt0wxse', firstName: 'amy', lastName: 'white', donations: [], role: "member"  },
            { _id: 'userId6',  email: 'david.miller@gmail.com', password: 'password', passwordHash: '$2b$10$AT8oh2C2JW6.B9qmi7UrEuQQwegVB91M2xszlQtO9kh.lZAt0wxse', firstName: 'david', lastName: 'miller', donations: [], role: "member"  },
            { _id: 'userId7',  email: 'emily.roberts@gmail.com', password: 'password', passwordHash: '$2b$10$AT8oh2C2JW6.B9qmi7UrEuQQwegVB91M2xszlQtO9kh.lZAt0wxse', firstName: 'emily', lastName: 'roberts', donations: [], role: "member"  },
            { _id: 'userId8', email: 'alex.parker@gmail.com', password: 'password', passwordHash: '$2b$10$AT8oh2C2JW6.B9qmi7UrEuQQwegVB91M2xszlQtO9kh.lZAt0wxse', firstName: 'alex', lastName: 'parker', donations: [], role: "member"  },
            { _id: 'userId9',  email: 'lisa.king@yahoo.com', password: 'password', passwordHash: '$2b$10$AT8oh2C2JW6.B9qmi7UrEuQQwegVB91M2xszlQtO9kh.lZAt0wxse', firstName: 'lisa', lastName: 'king', donations: [], role: "member"  },
            { _id: 'userId10',  email: 'ryan.jones@gmail.com', password: 'password', passwordHash: '$2b$10$AT8oh2C2JW6.B9qmi7UrEuQQwegVB91M2xszlQtO9kh.lZAt0wxse', firstName: 'ryan', lastName: 'jones', donations: [], role: "member"  },
            { _id: 'userId11',  email: 'carol.martin@gmail.com', password: 'password', passwordHash: '$2b$10$AT8oh2C2JW6.B9qmi7UrEuQQwegVB91M2xszlQtO9kh.lZAt0wxse', firstName: 'carol', lastName: 'martin', donations: [], role: "member"  }
            ];
    
            // Array to store promises for each seeding operation
            const promises = [];
    
            for (const userData of users) {
                promises.push(new Promise((innerResolve, innerReject) => {
                    this.dbManager.db.findOne({ $or: [{ email: userData.email }, { _id: userData._id }] }, (err, existingUser) => {
                        if (err) {
                            console.error('Error checking for existing user:', err);
                            innerReject(err);
                            return;
                        }
    
                        if (!existingUser) {
                            this.dbManager.db.insert(userData, (insertErr, newDoc) => {
                                if (insertErr) {
                                    console.error('Error seeding user data:', insertErr);
                                    innerReject(insertErr);
                                    return;
                                }
                                console.log('User data seeded:', newDoc);
                                innerResolve(newDoc); // Resolve the inner promise
                            });
                        } else {
                            console.log(`User with email ${userData.email} or ID ${userData.id} already exists and will not be seeded into the DB.`);
                            innerResolve(); // Resolve the inner promise
                        }
                    });
                }));
            }
    
            // Resolve the outer promise once all inner promises are resolved
            Promise.all(promises)
                .then(() => {
                    resolve('User data seeding completed');
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    
    //creating a new user with defined parameters
    async createUser(email, firstName, lastName, password = []) {
        
        const newUser = {
        email,
        firstName,
        lastName,
        password,//need to take this out eventually
        passwordHash : await this.hashPassword(password), //using the password to store a hashed version
        donations : [], //creating an empty array of donations for a user
        role : "member" // assigning member role to user
        };

        //insert user into DB
        this.dbManager.db.insert(newUser, (err, insertedUser) => {
        if (!err) {
            console.log('User created:', insertedUser);
        } else {
            console.error('Error creating user:', err);
        }
        });
    }

    //a function to return all users from the database by using the email - only users have an email
    getAllUsers() {
    return new Promise((resolve, reject) => {
        this.dbManager.db.find({ email: { $exists: true } }, function(err, users) {
            if (err) {
                reject(err);//reject promise
            } else {
                resolve(users);//resolve promise
                console.log('function getAllUsers() returns: ', users);
            }
            
            })
        })
    }

    // Define findById method
    findById(userId, cb) {
        this.dbManager.db.findOne({ _id: userId }, function(err, user) {
            if (err) {
                return cb(err, null);
            }
            cb(null, user);
        });
    };
    
    //returns users in the DB with matching email
    lookupEmail(email, cb) {
        this.dbManager.db.find({ 'email': email }, function (err, entries) {
            if (err) {
                return cb(err, null);
            } else {
                if (entries.length === 0) {
                    return cb(null, null);
                }
                return cb(null, entries[0]);
            }
        });
    }

    //hashes the users password
    async hashPassword(password) {
        const saltRounds = 10;//higher the saltRounds the more secure the hash
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (err) {
                    console.log('error generating salt for password hash');
                    reject(err);
                }
                //hashing password
                bcrypt.hash(password, saltRounds, (err, hash) => { //CHANGE THIS TO 'SALT' TO ADD SALT GEN - currently just passes in salt rounds
                    if (err) {
                        console.log('error hashing password');
                        reject(err);
                    }
                    console.log('Hashed Password:', hash);
                    resolve(hash);//returns hashed password 
                });
            });
        });
    }
}

//initializing user functions to DB
const user = new User(dbManager);

user.seedData();

module.exports = user;