module.exports = function(app, db) {

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

    var cleanupAndError = function(err) {
      //delete the lander we were working on
      db.landers.deleteLander(user, lander_id, function(deleteLanderErr) {
        if (deleteLanderErr) {
          callback(deleteLanderErr, [myJobId])
        } else {
          callback(err, [myJobId]);
        }
      });
    };

    var lander_file = attr.files[0];

    //get filename
    var stagingDir = lander_file.filename;
    var stagingPath = "staging/" + lander_file.filename;
    var sourcePathZip = stagingPath + ".zip";

    //rename it to .zip
    fs.rename(stagingPath, sourcePathZip, function(err) {
      if (err) {
        cleanupAndError(err);
      } else {
        //unzip it
        // unzip(sourcePathZip, { dir: stagingPath }, function(err) {
        cmd.get("unzip " + sourcePathZip + " -d " + stagingPath + " &> /dev/null", function(output) {

          console.log("UNZIP OUTPUT: " + output);

          var usingStagingPath = stagingPath;
          //if only 1 folder in unzipped file use the folder as root instead of
          //the original. (this fixes if people put their lander in a folder and compress the folder)
          fs.readdir(stagingPath, function(err, files) {
            if (err) {
              cleanupAndError(err);
            } else {
              if (files.length == 1) {
                var dirName = files[0];
                var innerDirPath = stagingPath + "/" + dirName;

                var isDirectory = fs.lstatSync(innerDirPath).isDirectory();
                if (isDirectory) {


                  //remove spaces from directory #rename it
                  var newDirName = dirName.replace(/\s+/g, '');
                  var newDirPath = stagingPath + "/" + newDirName;
                  //just rename sync since its way easier than callback bs
                  fs.renameSync(innerDirPath, newDirPath);

                  app.log("using inner directory: " + newDirPath, "debug");

                  //set stagingDir to include this file
                  usingStagingPath = newDirPath;
                  usingInnerDirectory = true;
                }
              }

              db.jobs.updateDeployStatus(user, myJobId, 'initializing:add_optimizing', function(err) {
                if (err) {
                  cleanupAndError(err);
                } else {

                  db.landers.addS3FolderDeploymentFolderToLander(user, lander_id, stagingDir, function(err) {
                    if (err) {
                      cleanupAndError(err);
                    } else {
                      var deleteStaging = false;
                      //rip and add lander both call this to finish the add lander process           
                      db.landers.common.add_lander.addOptimizePushSave(deleteStaging, user, usingStagingPath, stagingDir, landerData, function(err, data) {
                        if (err) {
                          cleanupAndError(err);
                        } else {
                          //delete the staging area ourselves since we may have used an inner folder.
                          //delete the whole staging dir, not just the inner folder
                          db.common.deleteStagingArea(stagingPath, function(err) {
                            if (err) {
                              cleanupAndError(err);
                            } else {
                              db.jobs.updateDeployStatus(user, myJobId, 'not_deployed', function(err) {
                                if (err) {
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

        });
      }
    });

  };


  return module.addLander;

};
