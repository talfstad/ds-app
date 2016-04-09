module.exports = function(app, passport) {
  var module = {};

  var config = require("../../config");
  var Puid = require('puid');
  var utils = require('../../utils/utils.js')();
  var db = require("../../db_api");

  var ripLander = require("./rip_lander")(app, passport);

  app.get('/api/landers', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    db.landers.getAll(user, function(err, rows) {
      if (err) {
        res.json({ error: err });
      } else {
        res.json(rows);
      }
    });
  });


  app.post('/api/landers', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var landerData = req.body;
    var source = landerData.source;

    if (source == "duplicate") {
      db.landers.addNewDuplicateLander(user, duplicateLanderData, function(duplicateLanderWithIdAttributes) {

        res.json(duplicateLanderWithIdAttributes);

      });
    } else if (source == "rip") {

      ripLander.new(user, landerData, function(err, returnData) {
        if (err) {
          res.json({error: err});
        } else {

          console.log(JSON.stringify(returnData));

          res.json({
            id: landerData.id,
            created_on: landerData.created_on
          });
        }
      });


    }

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

