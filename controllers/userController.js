//importing relevant libraries
const User = require('../models/userModel');
const Donation = require('../models/donationModel');

exports.register_page = function(req, res) {
    res.render("user/register");

}; 

exports.login_page = function(req, res) {
    res.render("user/login");
};

exports.handle_login = function (req, res) {
    //redirect back to home page
    res.redirect('/home');
}; 
    
//username, email, firstName, lastName, password
exports.register_new_user = function (req, res) {
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName= req.body.lastName;
    const password = req.body.password;
  
    if (!email || !firstName || !lastName ||  !password) {
      res.send(401, "please fill in all data fields");
      return;
    }

    User.lookupEmail(email, function (err, u) {
      if (u) {
        res.send(401, "User exists with email:"+ email);
        return;
      }
      User.createUser(email, firstName, lastName, password);
      console.log("register user", User, "password", password);
      res.redirect('/user/login');
    });
  };

  exports.logout = function (req, res) {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).send('Error logging out');
        } else {
            // Clear any existing cookies
            res.clearCookie('session');
            // Redirect the user to the home page or any other desired destination
            res.redirect('/');
        }
    });
};

//returns the logged in users details
exports.details = function (req, res) {
  //Access session details from req.sessionDetails
  const userId = req.sessionDetails.userId;
  User.findById(userId, function (err, user) {
    if (err) {
        console.log("Error looking up user", err);
        return res.status(401).send();
    }
    if (!user) {
        return res.render("error looking up user - does not exist");
    }
    // Once user is found, retrieve donations for the user
    Donation.getUsersDonations(userId, function (err, donations) {
        if (err) {
            console.log("Error looking up donations", err);
            return res.status(401).send();
        }
        if (!donations) {
            return res.render("error looking up donation - does not exist");
        }
        // Render the view with user and donations data
        res.render('user/details', { user: user, donations: donations });
    });
});


};

  exports.get_all_users = async(req, res) => {
    try {
        // Query the database for seeded data (adjust the querying logic based on your data structure)
        const users = await User.getAllUsers();
        // Render the data
        res.json({ users });
    } catch (error) {
        console.error('Error processing GET request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
  