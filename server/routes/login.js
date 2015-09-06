exports.initialize = function(app, db, login) {

    var Puid = require('puid');
    var bcrypt = require("bcrypt-nodejs");
    var validator = require('validator');
    var utils = require('../utils/utils.js')();
    var config = require("../config");

    app.post("/api/login", login.authenticate(), function(req, res) {
        //this is only executed if login succeeded
        if (req.body.remember) {
      //1 year lifespan babayy
      req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
        } else {
            req.session.cookie.expires = false;
        }
        res.json({
            logged_in: true
        });
    });

    app.get('/api/login', function(req, res){
        if (req.user) {
            // logged in
            res.json({logged_in: true});
        } else {
            // not logged in
            res.json({logged_in: false});
        }
    });

    app.get('/api/logout', function(req, res) {
        req.logout();
    res.json({logged_in: false});
    });

    app.post("/api/login/signup", function(req, res) {
        var uid = Puid(true); // generate puid (short-version 12-chars) without nodeId / **Shortcut**
        var username = req.body.username;
        var password = req.body.password;

        if (validator.isEmail(username)) { //username is an email
            db.users.addUser(username, bcrypt.hashSync(password, bcrypt.genSaltSync(8)), uid, function(error) {
                if (error) {
                    res.json({
                        error: error
                    });
                } else {
                    var message = "TODO: email confirm email";
                    var subject = "Confirm Moonlander e-mail address.";
                    utils.sendEmail(config.adminEmail, config.adminEmailPassword, username, subject, message, function(error){
                        if(error) {
                            console.log("Error sending validation email");
                        }
                        else {
                            res.json({
                                success : "Confirmation e-mail sent to: " + username
                            });
                        }
                    });
                }
            });
        }
        else {
            res.json({error: "Username must be a valid email address"});
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
                var message = "Reset password by clicking this link: https://localhost:3000/login/reset/new/"+code;
                var subject = "Reset your Moonlander password.";

                utils.sendEmail(config.adminEmail, config.adminEmailPassword, username, subject, message, function(error){
                    if(error) {
                        res.json({
                            emailSent: false,
                            error: "Error sending email to: " + username
                        });
                    }
                    else {
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

};