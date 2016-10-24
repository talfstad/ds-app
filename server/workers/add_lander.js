module.exports = function(app, dbApi, controller) {

  var module = {};

  module.addLander = function(user, attr, callback) {

    var unzip = require("extract-zip");
    var fs = require("fs");
    var cmd = require("node-cmd");

    var me = this;
    var myJobId = attr.id;
    var lander_id = attr.lander_id;

    var landerData = {
      id: lander_id,
      name: attr.name,
      deploy_status: attr.deploy_status,
      created_on: attr.lander_created_on
    };

    var lander_file = attr.files[0];

    //get filename
    var stagingDir = lander_file.filename;
    var stagingPath = "staging/" + lander_file.filename;
    var sourcePathZip = stagingPath + ".zip";

    var cleanupAndError = function(err) {
      var finishOutCleanup = function(s3DownloadUrl) {
        dbApi.log.add_lander.error(err, user, s3DownloadUrl, function(addLanderErr) {
          dbApi.landers.deleteLander(user, lander_id, function(deleteLanderErr) {
            if (deleteLanderErr) {
              callback(deleteLanderErr, [myJobId]);
            } else {
              err.staging_path = stagingPath;
              callback(err, [myJobId]);
            }
          });
        });
      };

      if (err.code == "UserReportedInterrupt" || err.code == "TimeoutInterrupt") {
        //delete the lander we were working on
        controller.log.add_lander.pushBadLanderToS3(user, sourcePathZip, function(pushLanderErr, s3DownloadUrl) {
          finishOutCleanup(s3DownloadUrl);
        });
      } else {
        finishOutCleanup("did not store lander");
      }
      //this return makes sure this job is stopped immediately when the callback is run
      //TODO test this
      return;
    };

    controller.jobs.watchDog(user, myJobId);


    //rename it to .zip
    fs.rename(stagingPath, sourcePathZip, function(err) {
      if (err) {
        cleanupAndError(err);
      } else {
        //unzip it
        // unzip(sourcePathZip, { dir: stagingPath }, function(err) {
        cmd.get("unzip " + sourcePathZip + " -d " + stagingPath + " &> /dev/null", function(output) {

          var usingStagingPath = stagingPath;
          //if only 1 folder in unzipped file use the folder as root instead of
          //the original. (this fixes if people put their lander in a folder and compress the folder)
          fs.readdir(stagingPath, function(err, files) {
            if (err) {
              cleanupAndError(err);
            } else {

              if (files.length < 3) {
                //check if no macosx folder, and only 1 folder no non folders
                var innerDirToUse = false;
                var noHtmlFilesInRoot = true;
                _.each(files, function(dirName) {
                  var innerDirPath = stagingPath + "/" + dirName;
                  var isDirectory = fs.lstatSync(innerDirPath).isDirectory();

                  if (!isDirectory) {
                    noHtmlFilesInRoot = false;
                  }

                  if (dirName != "__MACOSX" && isDirectory) {
                    innerDirToUse = dirName;
                  }
                });

                if (innerDirToUse && noHtmlFilesInRoot) {

                  var innerDirPath = stagingPath + "/" + innerDirToUse;

                  //remove spaces from directory #rename it
                  var newDirName = innerDirToUse.replace(/\s+/g, '');
                  var newDirPath = stagingPath + "/" + newDirName;
                  //just rename sync since its way easier than callback bs
                  fs.renameSync(innerDirPath, newDirPath);

                  app.log("using inner directory: " + newDirPath, "debug");

                  //set stagingDir to include this file
                  usingStagingPath = newDirPath;
                }
              }

              dbApi.jobs.updateDeployStatus(user, myJobId, 'initializing:add_optimizing', function(err) {
                if (err) {
                  cleanupAndError(err);
                } else {

                  dbApi.landers.addS3FolderDeploymentFolderToLander(user, lander_id, stagingDir, function(err) {
                    if (err) {
                      cleanupAndError(err);
                    } else {

                      var options = {
                        deleteStaging: false,
                        jobId: myJobId
                      };

                      //rip and add lander both call this to finish the add lander process           
                      controller.landers.add.optimizePushSave(options, user, usingStagingPath, stagingDir, landerData, function(err, data) {
                        if (err) {
                          cleanupAndError(err);
                        } else {
                          //delete the staging area ourselves since we may have used an inner folder.
                          //delete the whole staging dir, not just the inner folder
                          dbApi.common.deleteStagingArea(stagingPath, function(err) {
                            if (err) {
                              cleanupAndError(err);
                            } else {
                              dbApi.jobs.updateDeployStatus(user, myJobId, 'not_deployed', function(err) {
                                if (err) {
                                  cleanupAndError(err);
                                } else {
                                  dbApi.jobs.checkIfExternalInterrupt(user, myJobId, function(err, interruptCode) {
                                    if (interruptCode) {
                                      err = err || { code: interruptCode };
                                      cleanupAndError(err);
                                    } else {
                                      callback(false, [myJobId]);
                                    }
                                  });
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });

        });
      }
    });

  };


  return module.addLander;

};
