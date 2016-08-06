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
    var no_optimize_on_save = modelAttributes.no_optimize_on_save;

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
                db.aws.s3.copyDirFromS3ToStaging(stagingPath, credentials, username, baseBucketName, directory, function(err) {
                  if (err) {
                    res.json({ error: { err } });
                  } else {

                    db.landers.common.add_lander.addOptimizePushSave(user, stagingPath, modelAttributes.s3_folder_name, modelAttributes, function(err, data) {
                      if (err) {
                        res.json({ error: { err } });
                      } else {

                        console.log("done optimziign TT: " + JSON.stringify(data));

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
}
