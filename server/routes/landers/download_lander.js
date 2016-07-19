module.exports = function(app, passport) {

  var Puid = require('puid');
  var db = require("../../db_api")(app);
  var path = require("path");
  var mkdirp = require("mkdirp");
  var rimraf = require("rimraf");
  var uuid = require("uuid");
  var zipFolder = require('zip-dir');
  var cmd = require('node-cmd');
  var find = require("find");
  var fs = require("fs");

  var module = {

    optimized: function(user, lander_id, callback) {
      var me = this;
      var username = user.user;

      db.users.getUserSettings(user, function(err, aws_access_key_id, aws_secret_access_key, aws_root_bucket) {
        db.landers.getAll(user, function(err, landers) {
          if (err) {
            callback(err);
          } else {

            var lander = landers[0];

            var s3_folder_name = lander.s3_folder_name;
            var lander_name = lander.name;

            var credentials = {
              accessKeyId: aws_access_key_id,
              secretAccessKey: aws_secret_access_key
            };

            db.common.createStagingArea(function(err, staging_path, staging_dir) {
              if (err) {
                callback(err);
              } else {
                var directory = path.join('landers', s3_folder_name, 'optimized');

                var unGzipFile = function(file, callback) {
                  var ext = file.split('.').pop();

                  if (app.config.noGzipArr.indexOf(ext) <= -1) {
                    //first rename it
                    var gzippedFile = file + ".gz";
                    fs.rename(file, gzippedFile, function(err) {
                      //-N restore original name, -f force overwrite, decompress, -S use suffix
                      //gzip -N -d -f -S .html index.html
                      cmd.get("nice gzip -c -d " + gzippedFile + " > " + file, function(data) {
                        //delete the gzipped version
                        fs.unlink(gzippedFile, function() {
                          callback(false);
                        });
                      });
                    });


                  } else {
                    callback(false);
                  }
                }

                //1. download original from s3
                db.aws.s3.copyDirFromS3ToStaging(staging_path, credentials, username, aws_root_bucket, directory, function(err) {
                  if (err) {
                    callback(err);
                  } else {

                    //2. UNGZIP!
                    find.file(staging_path, function(files) {
                      var asyncIndex = 0;
                      for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        unGzipFile(file, function() {
                          if (++asyncIndex == files.length) {
                            //all are done uncompressing
                            var zippedPath = path.join(staging_path, lander_name + '_optimized.zip');
                            //3. zip it
                            zipFolder(staging_path, { saveTo: zippedPath }, function(err) {
                              if (err) {
                                callback(err);
                              } else {
                                //4. return path
                                callback(false, zippedPath, function() {
                                  //5. delete staging
                                  db.common.deleteStagingArea(staging_path, function() {
                                    // deleted staging, sent download, do nothing. empty callback
                                  });
                                });
                              }
                            });
                          }
                        })
                      }
                    });
                  }
                });
              }
            });
          }
        }, [{ lander_id: lander_id }]);
      });
    },

    original: function(user, lander_id, callback) {
      var me = this;
      var username = user.user;

      db.users.getUserSettings(user, function(err, aws_access_key_id, aws_secret_access_key, aws_root_bucket) {
        db.landers.getAll(user, function(err, landers) {
          if (err) {
            callback(err);
          } else {

            var lander = landers[0];

            var s3_folder_name = lander.s3_folder_name;
            var lander_name = lander.name;

            var credentials = {
              accessKeyId: aws_access_key_id,
              secretAccessKey: aws_secret_access_key
            };

            db.common.createStagingArea(function(err, staging_path, staging_dir) {
              if (err) {
                callback(err);
              } else {
                var directory = path.join('landers', s3_folder_name, 'original');

                //1. download original from s3
                db.aws.s3.copyDirFromS3ToStaging(staging_path, credentials, username, aws_root_bucket, directory, function(err) {
                  if (err) {
                    callback(err);
                  } else {

                    var zippedPath = path.join(staging_path, lander_name + '_original.zip');
                    //2. zip it
                    zipFolder(staging_path, { saveTo: zippedPath }, function(err) {
                      if (err) {
                        callback(err);
                      } else {
                        //3. return path
                        callback(false, zippedPath, function() {
                          //4. delete staging
                          db.common.deleteStagingArea(staging_path, function() {
                            //deleted staging, sent download, do nothing. empty callback
                          });
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        }, [{ lander_id: lander_id }]);
      });
    }
  };

  return module;

}