module.exports = function(app, passport) {
  var module = {};

  var config = require("../../config");
  var Puid = require('puid');
  var db = require("../../db_api");

  var ripLander = require("./rip_lander")(app, passport);
  var copyLander = require("./copy_lander")(app, passport);
  var addLander = require("./add_lander")(app, passport);

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

    if (source == "add") {
      landerData.files = req.files;

      addLander.new(user, landerData, function(err, returnData) {
        res.json(returnData);
      });

    } else if (source == "rip") {

      ripLander.new(user, landerData, function(err, returnData) {
        if (err) {
          res.json({ error: err });
        } else {
          res.json({
            id: landerData.id,
            created_on: landerData.created_on,
            urlEndpointsJSON: landerData.urlEndpoints,
            s3_folder_name: landerData.s3_folder_name,
            deployment_folder_name: landerData.deployment_folder_name
          });
        }
      });


    } else if (source == "copy") {

      copyLander.new(user, landerData, function(err, returnData) {
        if (err) {
          res.json({ error: err });
        } else {
          res.json({
            id: landerData.id,
            created_on: landerData.created_on,
            s3_folder_name: landerData.s3_folder_name,
            deployment_folder_name: landerData.deployment_folder_name
          });
        }
      });
    }

  });

  //save lander optimizations & modified
  app.put('/api/landers/:id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var modelAttributes = req.body;

    db.landers.updateAllLanderData(user, modelAttributes, function(err, returnModelAttributes) {
      if (err) {
        if (err.code = "InvalidDeploymentFolderInput") {
          res.json(err);
        } else {
          res.json({ code: "CouldNotUpdateLander" });
        }

      } else {
        res.json(returnModelAttributes);
      }
    });

  });


  return module;

}
