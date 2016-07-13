module.exports = function(app, passport) {

  var Puid = require('puid');
  var puid = new Puid(true);
  var bcrypt = require("bcrypt-nodejs");
  var validator = require('validator');
  var db = require("../db_api")(app);
  var _ = require("underscore-node");
  var fs = require("fs");

  app.post("/api/login", passport.authenticate(), function(req, res) {
    //this is only executed if login succeeded

    var user = req.user;
    db.users.getUserSettings(user, function(error, access_key_id, secret_access_key, aws_root_bucket) {
      if (error) {
        console.log(error);
        res.json({});
      } else {
        res.json({
          user_id: req.user.id,
          username: req.user.user,
          logged_in: true,
          aws_access_key_id: access_key_id,
          aws_secret_access_key: secret_access_key,
          aws_root_bucket: aws_root_bucket
        });
      }
    }); //getAmazonAPIKeys

  });

  app.get('/api/login', function(req, res) {
    var user = req.user;

    if (req.user) {
      db.users.getUserSettings(user, function(error, access_key_id, secret_access_key, aws_root_bucket) {
        if (error) {
          console.log(error);
          res.json({});
        } else {
          res.json({
            user_id: req.user.id,
            username: req.user.user,
            logged_in: true,
            aws_access_key_id: access_key_id,
            aws_secret_access_key: secret_access_key,
            aws_root_bucket: aws_root_bucket
          });
        }
      }); //getAmazonAPIKeys
    } else {
      // not logged in
      res.json({
        logged_in: false,
      });
    }
  });

  app.get('/api/logout', passport.isAuthenticated(), function(req, res) {
    req.logout();
    res.json({
      logged_in: false
    });
  });


  app.post("/update_amazon_api_keys", function(req, res) {
    var access_key_id = req.body.access_key_id;
    var secret_access_key = req.body.secret_access_key;
    var user = req.user;
    db.users.addAmazonAPIKeys(access_key_id, secret_access_key, user, function(error) {
      booleanName = "updatedAmazonAPIKeys";
      res.json({});
    });
  });

};
