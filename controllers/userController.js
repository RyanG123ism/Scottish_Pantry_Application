//importing relevant libraries
const User = require('../models/userModel');

exports.register_page = function(req, res) {
    res.render("user/register");

}; 

exports.login_page = function(req, res) {
    res.render("user/login");
};

exports.handle_login = function (req, res) {
    res.render("home", {
     title: "Welcome Back",
     user: req.user
     });
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
    res.clearCookie("jwt").status(200).redirect("/");
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
  