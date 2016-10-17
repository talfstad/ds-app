module.exports = function(app, passport) {

  var Puid = require('puid');
  var db = require("../../db_api")(app);
  var validUrl = require("valid-url");


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

      //validate the name and url
      var name = landerData.name;
      var url = landerData.lander_url;

      if (validUrl.isHttpUri(url) || validUrl.isHttpsUri(url)) {
        ripLander.new(user, landerData, function(err, returnData) {
          if (err) {
            res.json({ err: err });
          } else {
            res.json(returnData);
          }
        });
      } else {
        res.json({ error: { code: "InvalidUrl" } });
      }

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
    var no_optimize_on_save = modelAttributes.no_optimize_on_save;
    var lander_id = modelAttributes.id;

    //update to not modified because we are updating
    modelAttributes.saveModified = false;

    db.landers.updateAllLanderData(user, modelAttributes, function(err, returnModelAttributes) {
      if (err) {
        if (err.code = "InvalidDeploymentFolderInput") {
          res.json(err);
        } else {
          res.json({ code: "CouldNotUpdateLander" });
        }
      } else {

        if (no_optimize_on_save) {
          res.json(returnModelAttributes);
        } else {
          //optimize lander and return new numbers for pagespeed!!

          //create staging dir
          db.common.createStagingArea(function(err, stagingPath, stagingDir) {

            db.aws.keys.getAmazonApiKeysAndRootBucket(user, function(err, awsData) {
              if (err) {
                res.json({ error: { err } });
              } else {

                var username = user.user;
                var baseBucketName = awsData.aws_root_bucket;

                var directory = "landers/" + modelAttributes.s3_folder_name + "/original";

                var credentials = {
                  accessKeyId: awsData.aws_access_key_id,
                  secretAccessKey: awsData.aws_secret_access_key
                }

                //copy the data down from the old s3, then push it to the new
                db.aws.s3.copyDirFromS3ToStaging(lander_id, stagingPath, credentials, username, baseBucketName, directory, function(err) {
                  if (err) {
                    res.json({ error: { err } });
                  } else {
                    var deleteStaging = true;
                    db.landers.common.add_lander.addOptimizePushSave(deleteStaging, user, stagingPath, modelAttributes.s3_folder_name, modelAttributes, function(err, data) {
                      if (err) {
                        res.json({ error: { err } });
                      } else {
                        res.json(data);
                      }
                    });

                  }
                });
              }
            });

          });
        }
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
            res.json({ error: err })
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

  app.get('/api/landers/notes/:id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var lander_id = req.params['id'];

    db.landers.getLanderNotes(user, lander_id, function(err, dbLanderNotes) {
      if (err) {
        res.json({ error: { code: "CouldNotGetNotes" } });
      } else {
        res.json({ notes: dbLanderNotes });
      }
    });
  });

  app.put('/api/landers/notes/:id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var landerData = req.body;
    var notes = landerData.notes;
    var notes_search = landerData.notes_search;
    //save lander data
    db.landers.updateNotes(user, landerData, function(err) {
      res.json({});
    });
  });

  app.put('/api/landers/name/:id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var landerData = req.body;
    var name = landerData.name;
    if (/.*[a-zA-Z0-9]+.*/.test(name)) {
      //save lander data
      db.landers.updateName(user, landerData, function(err) {
        res.json({});
      });
    } else {
      res.json({ error: { code: "CouldNotUpdateName" } })
    }
  });
}
