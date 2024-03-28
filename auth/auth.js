//importing relevant libraries
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

//handles login functionality
exports.login = function (req, res,next) {
    let email = req.body.email;
    let password = req.body.password;
  
    User.lookupEmail(email, function (err, user) {
      if (err) {
        console.log("error looking up user", err);
        return res.status(401).send();
      }
      if (!user) {
        let errorMessage = "could not find a user with that email address";
        return res.render("user/login", {errorMessage: errorMessage});
      } 
      
      //if the account is deactivated
      if(user.status == "deactivated")
      {
        let errorMessage = 'this account is currently deactivated';
        res.render('user/login', {errorMessage: errorMessage});
        return;
      }
      //compare provided password with stored passwordHash
      bcrypt.compare(password, user.passwordHash, function (err, result) {
        if (result) {
          //storing the user information in the session
          req.session.user = {
            email: email,
            id: user._id,
            role: user.role,//passing the role into the session
            status: user.status //status of the account - active / deactivated
          };
          next();
        } else {
          let errorMessage = "password incorrect";
          return res.render("user/login", {errorMessage: errorMessage});
        }
      });
    });
  }; 

  //verifies a user is logged in 
  exports.verify_logged_in = function (req, res, next) {
    //Check if user information is stored in the session
    if (!req.session.user) {
      console.log('user session not found');
      return res.status(403).send(); 
    } else {

      //if the account is deactivated
      if(req.session.user.status == "deactivated")
      {
        console.log('this account is currently deactivated');
        res.render('this account is currently deactivated');
        return;
      }

      //accessing session details
      const userId = req.session.user.id;
      const role = req.session.user.role;

      //passing session details through middleware
      req.sessionDetails = {userId, role};

      next();
    }
  };

  //verifies admin role
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

  //verifies manager or admin role
  exports.verify_manager_or_higher = function (req, res, next) {
    //Check if user information is stored in the session
    if (!req.session.user) {
      console.log('user session not found');
      return res.status(403).send(); 
    } 
    else 
    {

      //if the account is deactivated
      if(req.session.user.status == "deactivated")
      {
        console.log('this account is currently deactivated');
        res.render('this account is currently deactivated');
        return;
      }

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

  //verifies manager role
  exports.verify_manager = function (req, res, next) {
    //Check if user information is stored in the session
    if (!req.session.user) {
      console.log('user session not found');
      return res.status(403).send(); 
    } 
    else 
    {

      //if the account is deactivated
      if(req.session.user.status == "deactivated")
      {
        console.log('this account is currently deactivated');
        res.render('this account is currently deactivated');
        return;
      }

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

  //verifies member role
  exports.verify_member = function (req, res, next) {
    //Check if user information is stored in the session
    if (!req.session.user) {
      console.log('user session not found');
      return res.status(403).send(); 
    } 
    else 
    {

      //if the account is deactivated
      if(req.session.user.status == "deactivated")
      {
        console.log('this account is currently deactivated');
        res.render('this account is currently deactivated');
        return;
      }

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

  //verifies member, admin or manager role
  exports.verify_member_or_higher = function (req, res, next) {
    //Check if user information is stored in the session
    if (!req.session.user) {
      console.log('user session not found');
      return res.status(403).send(); 
    } 
    else 
    {

      //if the account is deactivated
      if(req.session.user.status == "deactivated")
      {
        console.log('this account is currently deactivated');
        res.render('this account is currently deactivated');
        return;
      }

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

