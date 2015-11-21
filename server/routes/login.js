module.exports = function(app, passport) {

  var Puid = require('puid');
    var puid = new Puid(true);
  var bcrypt = require("bcrypt-nodejs");
  var validator = require('validator');
  var utils = require('../utils/utils.js')();
  var config = require("../config");
    var db = require("../db_api");

    app.post("/api/login", passport.authenticate(), function(req, res) {
    //this is only executed if login succeeded
    if (req.body.remember) {
            //1 year lifespan babayy
            req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
    } else {
      req.session.cookie.expires = false;
    }

        var user = req.user;
        db.users.getUserSettings(user, function(error, access_key_id, secret_access_key, uid) {
            if(error) {
                console.log(error);
                utils.sendResponse(res, error, "settingsRetrieved");
            } else {
                //TODO: encrypt these?
                // res.cookie('access_key_id', access_key_id, { signed: true, maxAge: config.cookieMaxAge  });
                // res.cookie('secret_access_key', secret_access_key, { signed: true, maxAge: config.cookieMaxAge  });
                // res.cookie('uid', uid, { signed: true, maxAge: config.cookieMaxAge  });
                res.json({
      		    username: req.user.user,
                    logged_in: true,
                    aws_access_key_id: access_key_id,
                    aws_secret_access_key: secret_access_key,
                });
            }
        }); //getAmazonAPIKeys

  });

  app.get('/api/login', function(req, res) {
    if (req.user) {
      // logged in
      res.json({
        username: req.user.user,
        logged_in: true
      });
    } else {
      // not logged in
      res.json({
        logged_in: false,
      });
    }
  });

  app.get('/api/logout', function(req, res) {
    req.logout();
    res.json({
      logged_in: false
    });
  });

  app.post("/api/login/signup", function(req, res) {
        var uid = puid.generate(); // generate puid (short-version 12-chars) without nodeId / **Shortcut**
    var username = req.body.username;
    var password = req.body.password;

    if (validator.isEmail(username)) { //username is an email
      db.users.addUser(username, bcrypt.hashSync(password, bcrypt.genSaltSync(8)), uid, function(error) {
        if (error) {
          res.json({
                        error: error,
                        sentEmail: false
          });
        } else {
          var message = "TODO: email confirm email";
          var subject = "Confirm Moonlander e-mail address.";
          utils.sendEmail(config.adminEmail, config.adminEmailPassword, username, subject, message, function(error) {
            if (error) {
              console.log("Error sending validation email");
                            res.json({
                                error: "Error sending validation email to: " + username,
                                sentEmail: false
                            });
              res.json({
                                success : "Confirmation e-mail sent to: " + username,
                                sentEmail: true
              });
            }
          });
        }
      });
    } else {
      res.json({
        error: "Username must be a valid email address"
      });
    }
  });

  app.post("/api/login/request/reset", function(req, res) {
    var username = req.body.email;

    db.users.requestResetPassword(username, function(error, code) {
      if (error) {
        res.json({
          emailSent: false,
          error: error
        });
      } else {
        var message = "Reset password by clicking this link: https://localhost:3000/login/reset/" + code;
        var subject = "Reset your Moonlander password.";

        utils.sendEmail(config.adminEmail, config.adminEmailPassword, username, subject, message, function(error) {
          if (error) {
            res.json({
              emailSent: false,
              error: "Error sending email to: " + username
            });
          } else {
            res.json({
              emailSent: true
            });
          }
        });
      }
    });
  });

  app.post("/api/login/reset/check", function(req, res) {
    var code = req.body.code;
    var resetCodeLifespanMinutes = config.resetCodeLifespanMinutes;

    db.users.checkPasswordResetCode(code, resetCodeLifespanMinutes, function(error, isValid) {
      if (!isValid) {
        res.json({
          error: error,
          isValid: false
        });
      } else {
        res.json({
          success: "Code is valid.",
          isValid: true
        });
      }
    });

  });

  app.post("/api/login/reset/password", function(req, res) {
    var code = req.body.code;
    var password = req.body.password;
    var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8));

    //TODO: validate password length/complexity/same as old password
    db.users.resetPassword(code, hash, function(error) {
      if (error) {
        res.json({
          error: error
        });
      } else {
        res.json({
          success: "Successfully changed password."
        });
      }
        });
    });

    app.post("/update_amazon_api_keys", function(req, res) {
        var access_key_id = req.body.access_key_id;
        var secret_access_key = req.body.secret_access_key;
        var user = req.user;
        db.users.addAmazonAPIKeys(access_key_id, secret_access_key, user, function(error){
            booleanName = "updatedAmazonAPIKeys";
            utils.sendResponse(res, error, booleanName);
    });
  });

};
