module.exports = function(app, passport) {
  var module = {};

  var config = require("../config");
  var Puid = require('puid');
  var utils = require('../utils/utils.js')();
  var db = require("../db_api");


  app.get('/api/landers', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    db.landers.getAll(user, function(err, rows) {
      if(err) {
        res.json({error: err});
      } else {
        res.json(rows);
      }
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

  //save lander optimizations & modified
  app.put('/api/landers/:id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var modelAttributes = req.body;

    db.landers.updateLanderData(user, modelAttributes, function(returnModelAttributes) {
      res.json(returnModelAttributes);
    });

  });


  return module;

}
