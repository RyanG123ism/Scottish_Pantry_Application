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

  exports.verify_logged_in = function (req, res, next) {
    //Check if user information is stored in the session
    if (!req.session.user) {
      console.log('user session not found');
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

  exports.verify_admin = function (req, res, next) {
    //Check if user information is stored in the session
    if (!req.session.user) {
      console.log('user session not found');
      return res.status(403).send(); 
    } 
    else 
    {
      //accessing session details
      const role = req.session.user.role;
      const userId = req.session.user.id;

      if(role == "admin")
      {
        //verifying is complete - passing session details through middleware
        req.sessionDetails = {userId, role};
        next();
      }
      else
      {
        //return role insufficient 
        console.log('role access insufficient');
        return res.status(403).send(); 
      }     
    }
  };

  exports.verify_manager_or_higher = function (req, res, next) {
    //Check if user information is stored in the session
    if (!req.session.user) {
      console.log('user session not found');
      return res.status(403).send(); 
    } 
    else 
    {
      //accessing session details
      const role = req.session.user.role;
      const userId = req.session.user.id;

      //checking the session role is equal to manager or admin
      if(role == "manager" || role == "admin")
      {
        //verifying is complete - passing session details through middleware
        req.sessionDetails = {userId, role};
        next();
      }
      else
      {
        //return role insufficient 
        console.log('role access insufficient');
        return res.status(403).send(); 
      }     
    }
  };

  exports.verify_manager = function (req, res, next) {
    //Check if user information is stored in the session
    if (!req.session.user) {
      console.log('user session not found');
      return res.status(403).send(); 
    } 
    else 
    {
      //accessing session details
      const role = req.session.user.role;
      const userId = req.session.user.id;

      //checking the session role is equal to manager or admin
      if(role == "manager")
      {
        //verifying is complete - passing session details through middleware
        req.sessionDetails = {userId, role};
        next();
      }
      else
      {
        //return role insufficient 
        console.log('role access insufficient');
        return res.status(403).send(); 
      }     
    }
  };

  exports.verify_member = function (req, res, next) {
    //Check if user information is stored in the session
    if (!req.session.user) {
      console.log('user session not found');
      return res.status(403).send(); 
    } 
    else 
    {
      //accessing session details
      const role = req.session.user.role;
      const userId = req.session.user.id;

      //checking the session role is equal to manager or admin
      if(role == "member")
      {
        //verifying is complete - passing session details through middleware
        req.sessionDetails = {userId, role};
        next();
      }
      else
      {
        //return role insufficient 
        console.log('role access insufficient');
        return res.status(403).send(); 
      }     
    }
  };

  exports.verify_member_or_higher = function (req, res, next) {
    //Check if user information is stored in the session
    if (!req.session.user) {
      console.log('user session not found');
      return res.status(403).send(); 
    } 
    else 
    {
      //accessing session details
      const role = req.session.user.role;
      const userId = req.session.user.id;

      //checking the session role is equal to manager or admin
      if(role == "member" || role == "manager" || role == "admin")
      {
        //verifying is complete - passing session details through middleware
        req.sessionDetails = {userId, role};
        next();
      }
      else
      {
        //return role insufficient 
        console.log('role access insufficient');
        return res.status(403).send(); 
      }     
    }
  };

