module.exports = function(app, passport) {
  var module = {};

  var config = require("../config");
  var Puid = require('puid');
  var utils = require('../utils/utils.js')();
  var db = require("../db_api");

  app.post('/api/lander', passport.isAuthenticated(), function(req, res) {
    var lander_name = req.body.lander_name;
    var zip_full_path = req.files.myFile.path;
    var zip_name = req.files.myFile.originalname;

    var user = req.user;

    var uid = req.signedCookies.uid;
    var access_key_id = req.signedCookies.access_key_id;
    var secret_access_key = req.signedCookies.secret_access_key;

    var bucket_name = uid; //the archive bucket is the user's uid
    var puid = new Puid(true);
    var bucket_path = puid.generate(); //generate a random bucket path for the archive

    var s3 = require('../utils/s3')(access_key_id, secret_access_key);

    s3.archiveLander(bucket_name, bucket_path, zip_full_path, zip_name, function(error, download_url) {
      if (error) {
        utils.sendResponse(res, error, "landerUploaded");
      } else {
        db.landers.add(lander_name, download_url, user, function(error) {
          utils.sendResponse(res, error, "landerAdded");
        });
      }
    });

  });

  app.get('/api/landers', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    db.landers.getAll(user, function(rows) {
      res.json(rows);
    });
  });


  //called when adding a DUPLICATE lander! not a new lander. this is because adding a new lander
  //takes a JOB worth of work where as this is just copying db fields
  app.post('/api/landers', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var duplicateLanderData = req.body;
    db.landers.addNewDuplicateLander(user, duplicateLanderData, function(duplicateLanderWithIdAttributes) {

      res.json(duplicateLanderWithIdAttributes);

    });

  });


  app.get('/api/lander', passport.isAuthenticated(), function(req, res) {

  });

  //save lander optimizations & modified
  app.put('/api/landers/:id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var modelAttributes = req.body;

    db.landers.updateLanderData(user, modelAttributes, function(returnModelAttributes) {
      res.json(returnModelAttributes);
    });

  });

  app.delete('/api/landers/:id', passport.isAuthenticated(), function(req, res) {
    res.json({})
  });

  return module;

}
