//importing relevant libraries
const User = require('../models/userModel');
const Donation = require('../models/donationModel');

//render register page
exports.register_page = function(req, res) {
    res.render("user/register");
}; 

//render login page
exports.login_page = function(req, res) {
    res.render("user/login");
};

//redirects user back to home page after login has been authorised
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
    //destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).send('Error logging out');
        } else {
            //clear any existing cookies
            res.clearCookie('session');
            res.redirect('/');
        }
    });
};

//returns the logged in users details
exports.details = async function (req, res) {
  //Access session details from req.sessionDetails OR req.bod - depends how we got here
  let userId = null;
  if(!req.params.userId)
  {
    //will be set to this if aser is accessing their own details
    userId = req.sessionDetails.userId;
  }
  else{
    //will use req.params if accessing from admin role OR user has edited their details and is being redirected back here.
    userId = req.params.userId;
  }
  
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

//returns page for admin to create a user  
exports.create_user = function (req, res) {
    res.render('admin/createUser');
};

//creates a new user by the admin  
exports.post_create_user = function (req, res) {
    //getting req.body data
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName= req.body.lastName;
    const password = req.body.password;
    const role = req.body.role;

    let errorMessage = null;

    if (!email || !firstName || !lastName ||  !password || !role) {
        errorMessage = "please fill in all the required fields";
        res.render('admin/createUser', {errorMessage: errorMessage})
        return;
      }
  
      User.lookupEmail(email, function (err, u) {
        if (u) {
            errorMessage = "email is taken already";
            res.render('admin/createUser', {errorMessage: errorMessage})
            return;
        }

        User.createUser(email, firstName, lastName, password, role);
        console.log("register user", User, "password", password);

        //cant use async on non async functions so adding a timeout to wait 2 secs, otherwise next page will load without the newly created user
        setTimeout(() => {
            // Redirecting to dashboard after 2 seconds
            res.redirect('/admin/user_dashboard');
        }, 2000); // 2000 milliseconds = 2 seconds

      });
};

//edits an existing user
exports.edit = function (req, res) {
    //getting the user id from the req params
    const userId = req.params.userId;

    User.findById(userId, (err, user) => {
        if (err) {
            console.log('error locating user');
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!user) {
            console.log('user not found');
            return res.status(404).json({ error: 'User not found' });
        }

        //sending the user to the view
        res.render('user/edit', {user})
    });
};

//edits an existing user
exports.post_edit =  async(req, res) => {
    //getting the user id from the req params
    const userId = req.params.userId;

    User.findById(userId, (err, user) => {
        if (err) {
            console.log('error locating user');
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!user) {
            console.log('user not found');
            return res.status(404).json({ error: 'User not found' });
        }

        //getting updated details from req.body
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;

        //sending to update method with ID
        User.update(user._id, firstName, lastName, email, user.role);

        //sending too details page to review changes
        res.redirect('/user/details/' + user._id);
    });
};

//changes users status - activated/deactivated
exports.update_status = function (req, res) {
    //getting the user id from the req params
    const userId = req.params.userId;
    let updatedStatus = null;

    User.findById(userId, (err, user) => {
        if (err) {
            console.log('error locating user');
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!user) {
            console.log('user not found');
            return res.status(404).json({ error: 'User not found' });
        }
        if(user.status == "active")
        {
            updatedStatus = user.status = "deactivated";
        }else{
            updatedStatus = user.status = "active";
        }
        
        //sending to update method with ID
        User.update(user._id, user.firstName, user.lastName, user.email, updatedStatus);

        //sending too admin user dashboard page to review changes
        res.redirect('/admin/user_dashboard');
    });
};


  