module.exports = function(app, passport, dbApi, controller) {
  var hasher = require('wordpress-hash-node');
  var Puid = require('puid');
  var puid = new Puid(true);
  var validator = require('validator');
  var _ = require("underscore-node");
  var fs = require("fs");
  var sendEmail = require("../utils/send_email")(app);

  app.post("/api/login", passport.authenticate(), function(req, res) {
    //this is only executed if login succeeded
    var user = req.user;
    dbApi.users.getUserSettings(user, function(error, attr) {
      if (error) {
        res.json({});
      } else {
        var aws_access_key_id = attr.aws_access_key_id;
        var aws_secret_access_key = attr.aws_secret_access_key;
        var aws_root_bucket = attr.aws_root_bucket;

        res.json({
          user_id: req.user.id,
          username: req.user.user,
          logged_in: true,
          aws_access_key_id: aws_access_key_id,
          aws_secret_access_key: aws_secret_access_key,
          aws_root_bucket: aws_root_bucket
        });
      }
    });

  });

  app.post("/api/user-settings", function(req, res) {
    var attr = req.body;
    var user = req.user;
    //save the user settings and return
    dbApi.users.saveUserSettings(user, attr, function(err) {
      if (err) {
        res.json({error: true});
      } else {
        res.json({});
      }
    });
  });

  app.get('/api/login', function(req, res) {
    var user = req.user;

    if (req.user) {
      dbApi.users.getUserSettings(user, function(err, attr) {
        if (err) {
          res.json({});
        } else {
          attr.logged_in = true;
          attr.username = req.user.user,

          res.json(attr);
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

  app.post("/api/login/request/reset", function(req, res) {
    var email = req.body.email;
    dbApi.users.requestResetPassword(email, function(err, code) {
      if (err) {
        res.json({
          emailSent: false,
          error: err
        });
      } else {
        var link = "https://" + app.config.subdomain + ".landerds.com/login/reset/" + code;
        var filePath = __dirname + "/../html_email_templates/reset_password_template.tpl";

        fs.readFile(filePath, 'utf8', function(err, file) {
          if (err) {
            res.json({
              emailSent: false,
              error: err
            });
          } else {
            var tpl = _.template(file);
            var message = tpl({ reset_password_link: link });

            var subject = "LanderDS Password Reset";
            sendEmail(app.config.adminEmail, app.config.adminEmailPassword, email, subject, message, function(err) {
              if (err) {
                res.json({
                  emailSent: false,
                  error: err
                });
              } else {
                res.json({
                  emailSent: true
                });
              }
            });
          }
        });
      }
    });
  });

  app.post("/api/login/reset/check", function(req, res) {
    var code = req.body.code;
    dbApi.users.checkPasswordResetCode(code, app.config.resetPasswordCodeLifespanMinutes, function(error, isValid) {
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

    var hash = hasher.HashPassword(password);
    console.log("hash: " + hash + " pasword: " + password);

    //TODO: validate password length/complexity/same as old password
    dbApi.users.resetPassword(code, hash, function(error) {
      if (error) {
        res.json({
          error: error
        });
      } else {
        res.json({
          success: true
        });
      }
    });
  });
};
