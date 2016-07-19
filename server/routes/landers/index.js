module.exports = function(app, passport) {

  var Puid = require('puid');
  var db = require("../../db_api")(app);

  var ripLander = require("./rip_lander")(app, passport);
  var copyLander = require("./copy_lander")(app, passport);
  var addLander = require("./add_lander")(app, passport);
  var downloadLander = require("./download_lander")(app, passport);

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
        if (err) {
          res.json({ err: err });
        } else {
          res.json(returnData);
        }
      });

    } else if (source == "rip") {

      ripLander.new(user, landerData, function(err, returnData) {
        if (err) {
          res.json({ err: err });
        } else {
          res.json(returnData);
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

  app.get('/api/landers/download', passport.isAuthenticated(), function(req, res) {
    var user = req.user;

    //get which one to download?
    //?version=optimized&id=s3_folder_name
    var version = req.query.version;
    var lander_id = req.query.id;
    if (version == 'optimized' || version == 'original') {
      if (lander_id) {
        downloadLander[version](user, lander_id, function(err, fileName, callback) {
          if (err) {
            res.json({error: err})
          } else {
            res.download(fileName, callback);
          }
        });
      } else {
        res.json({ error: 'No valid id in request' });
      }
    } else {
      res.json({ error: 'No valid Version to get' });
    }
  });
}
