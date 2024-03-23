//importing relevant libraries
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken"); 
const User = require('../models/userModel');
const hardcodedSecret = "scottishPantryApp123456";

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
          //use the payload to store information about the user such as username.
          let payload = { email: email };
          //create the access token 
          let accessToken = jwt.sign(payload, hardcodedSecret,{expiresIn: 300}); 
          res.cookie("jwt", accessToken);
          next();
        } else {
          return res.render("user/login");
        }
      });
    });
  }; 

  exports.verify = function (req, res, next) {
    let accessToken = req.cookies.jwt;
    if (!accessToken) {
      return res.status(403).send();
    }
    let payload;
    try {
      payload = jwt.verify(accessToken, hardcodedSecret);
      next();
    } catch (e) {
      //if an error occured return request unauthorized error
      res.status(401).send();
    }
  };