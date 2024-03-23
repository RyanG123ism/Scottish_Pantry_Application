//importing relevant libraries
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

exports.login = function (req, res,next) {
    let email = req.body.email;
    let password = req.body.password;
  
    User.lookupEmail(email, function (err, user) {
      if (err) {
        console.log("error looking up user", err);
        return res.status(401).send();
      }
      if (!user) {
        return res.render("account/register");
      }    
      //compare provided password with stored passwordHash
      bcrypt.compare(password, user.passwordHash, function (err, result) {
        if (result) {
          //storing the user information in the session
          req.session.user = {
            email: email,
            id: user._id,
            role: user.role//passing the role into the session
          };
          next();
        } else {
          return res.render("user/login");
        }
      });
    });
  }; 

  exports.verify = function (req, res, next) {
    //Check if user information is stored in the session
    if (!req.session.user) {
      return res.status(403).send(); 
    } else {

      //accessing session details
      const userId = req.session.user.id;
      const role = req.session.user.role;

      //passing session details through middleware
      req.sessionDetails = {userId, role};

      next();
    }
  };

