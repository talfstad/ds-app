module.exports = function(app, passport) {

  var db = require("../../db_api")(app);
  var unzip = require("extract-zip");
  var fs = require("fs");
  var module = {

    new: function(user, landerData, callback) {

      var me = this;

      var lander_file = landerData.files[0];
      //get filename
      var stagingDir = lander_file.filename;
      var stagingPath = "staging/" + lander_file.filename;
      var sourcePathZip = stagingPath + ".zip";

      //rename it to .zip
      fs.rename(stagingPath, sourcePathZip, function(err) {
        if (err) {
          callback(err)
        } else {

          //unzip it
          unzip(sourcePathZip, { dir: stagingPath }, function(err) {
            if (err) {
              callback(err);
            } else {
              var usingStagingPath = stagingPath;
              //if only 1 folder in unzipped file use the folder as root instead of
              //the original. (this fixes if people put their lander in a folder and compress the folder)
              fs.readdir(stagingPath, function(err, files) {
                if (err) {
                  callback(err);
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

                  var deleteStaging = false;
                  //rip and add lander both call this to finish the add lander process           
                  db.landers.common.add_lander.addOptimizePushSave(deleteStaging, user, usingStagingPath, stagingDir, landerData, function(err, data) {
                    if (err) {
                      callback(err);
                    } else {
                      //delete the staging area ourselves since we may have used an inner folder.
                      //delete the whole staging dir, not just the inner folder
                      db.common.deleteStagingArea(stagingPath, function(err) {
                        if (err) {
                          callback(err);
                        } else {
                          callback(false, data);
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
  };

  return module;

}
