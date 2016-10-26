module.exports = function(app, passport, dbApi, controller) {

  var Puid = require('puid');
  var validUrl = require("valid-url");

  var copyLander = require("./copy_lander")(app, passport, dbApi, controller);

  app.get('/api/landers', passport.isAuthenticated(), function(req, res) {
    var user = req.user;

    dbApi.landers.getAll(user, function(err, rows) {
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

    if (source == "copy") {
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

  //delete rip error/add error
  app.put('/api/landers/error/save/:id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var lander_id = req.params['id'];

    //update job to userinterrupt and error = true;
    dbApi.jobs.userReportedInterruptAllRunningJobsOnLander(user, lander_id, function(err) {
      res.json({});
    });
  });

  app.put('/api/landers/report/:id', passport.isAuthenticated(), function(req, res) {

    var user = req.user;
    var lander_id = req.params['id'];


    //get the lander from db check if rip, if not download the lander into staging and push it into our s3
    //log it, message user
    dbApi.landers.reportBroken(user, lander_id, function(err, landerData) {
      res.json({}); //return here don't need to show user we're working, gui is all updated.

      if (landerData.ripped_from) {
        controller.log.rip.error(err, user, landerData, function(err) {
          controller.intercom.messageAlertFixingRip(user, function(result) {
          
            app.log("ripped error reported", "debug");
          });
        });
      } else {
        controller.log.add_lander.getBadLanderFromS3(user, lander_id, function(err, sourcePathZip) {
          controller.log.add_lander.pushBadLanderToS3(user, sourcePathZip, function(pushLanderErr, s3DownloadUrl) {
            controller.intercom.messageAlertFixingLander(user, function(result) {
              dbApi.log.add_lander.error(err, user, landerData.name, s3DownloadUrl, function(addLanderErr) {
              
                app.log("add lander error reported", "debug");
              });
            });
          });
        });
      }
    });
  });

  //delete if during add or rip
  app.put('/api/landers/error/:id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var lander_id = req.params['id'];

    //update job to userinterrupt and error = true;
    dbApi.jobs.cancelAnyCurrentRunningJobsOnLander(user, lander_id, function(err) {
      //return success
      res.json({});
    });

  });

  //save lander optimizations & modified
  app.put('/api/landers/:id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var modelAttributes = req.body;
    var no_optimize_on_save = modelAttributes.no_optimize_on_save;
    var lander_id = modelAttributes.id;


    //make sure add error is not set on a put unless its time to delete the lander !
    var addError = modelAttributes.addError;
    if (addError) {
      if (addError.delete) {
        console.log("add error !!");
        return;
      } else {
        console.log("not adding as error just canceling");
        return;
      }
      res.json({});
    }


    //update to not modified because we are updating
    modelAttributes.saveModified = false;

    dbApi.landers.updateAllLanderData(user, modelAttributes, function(err, returnModelAttributes) {
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
          dbApi.common.createStagingArea(function(err, stagingPath, stagingDir) {

            dbApi.aws.keys.getAmazonApiKeysAndRootBucket(user, function(err, awsData) {
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
                controller.aws.s3.copyDirFromS3ToStaging(lander_id, stagingPath, credentials, username, baseBucketName, directory, function(err) {
                  if (err) {
                    res.json({ error: { err } });
                  } else {
                    var deleteStaging = true;
                    controller.landers.add.optimizePushSave(deleteStaging, user, stagingPath, modelAttributes.s3_folder_name, modelAttributes, function(err, data) {
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
        controller.landers.download[version](user, lander_id, function(err, fileName, callback) {
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

    dbApi.landers.getLanderNotes(user, lander_id, function(err, dbLanderNotes) {
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
    dbApi.landers.updateNotes(user, landerData, function(err) {
      res.json({});
    });
  });

  app.put('/api/landers/name/:id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var landerData = req.body;
    var name = landerData.name;
    if (/.*[a-zA-Z0-9]+.*/.test(name)) {
      //save lander data
      dbApi.landers.updateName(user, landerData, function(err) {
        res.json({});
      });
    } else {
      res.json({ error: { code: "CouldNotUpdateName" } })
    }
  });
}
