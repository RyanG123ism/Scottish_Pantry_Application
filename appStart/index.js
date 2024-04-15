//importing relevant libraries
const express = require('express');
const mustache = require('mustache-express');
const session = require('express-session');
const path = require('path');
var cors = require('cors');
const dbManager = require('../data/databaseManager.js');//not using at the moment

//creating the application
const app = express();

//seeds the database
// dbManager.seedDatabase()
//     .then(() => {
//         console.log('Database seeding completed');
//     })
//     .catch(error => {
//         console.error('Error seeding database:', error);
//     });


// Set up session middleware
app.use(session({
    secret: 'SCP_APPLICATION',
    resave: false,
    saveUninitialized: false
}));

app.use(express.urlencoded({extended: false }));//lets us parse data inside URL's
app.use(cors())//Cross-Origin Resource Sharing - restrict web pages from making requests to a different domain than the one that served the web page

//lets use serve static files - all files located in /public
const public = path.join(__dirname,'public');
app.use(express.static(public));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

//configuring mustache engine
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, '..', 'views'));

//points the app to the relevant router for initial start up
const homeRoutes = require('../routes/homeRoutes.js');
const userRoutes = require('../routes/userRoutes');
const contactRoutes = require('../routes/contactRoutes');
const adminRoutes = require('../routes/adminRoutes');
const donationRoutes = require('../routes/donationRoutes');
const warehouseRoutes = require('../routes/warehouseRoutes');
const managerRoutes = require('../routes/managerRoutes');

//configuring routes
app.use('/', homeRoutes);
app.use('/user', userRoutes);
app.use('/contact', contactRoutes);
app.use('/admin', adminRoutes);
app.use('/donation', donationRoutes);
app.use('/warehouse', warehouseRoutes);
app.use('/manager', managerRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server started on port ${PORT}');
})

//app listening on port 3000
// app.listen(3000, () => {
//     console.log('Server started on port 3000. Ctrl^c to quit.');
// })
