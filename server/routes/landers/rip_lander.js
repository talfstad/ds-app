module.exports = function(app, passport) {

  var config = require("../../config");
  var Puid = require('puid');
  var utils = require('../../utils/utils.js')();
  var db = require("../../db_api");

  var mkdirp = require("mkdirp");
  var rimraf = require("rimraf");
  var uuid = require("uuid");

  var scraper = require('website-scraper');

  var module = {

    new: function(user, landerData, callback) {

      var me = this;



      //1. rip the lander and its resources into staging
      this.scrape(landerData, function(err, stagingPath, stagingDir) {
        if (err) {
          callback(err);
        } else {

          //2. create new folder for this lander (random name)
          //  in landerds/<user>/landers/
          db.aws.keys.getAmazonApiKeysAndRootBucket(user, function(err, awsData) {
            if (err) {
              callback(err);
            } else {

              var credentials = {
                accessKeyId: awsData.aws_access_key_id,
                secretAccessKey: awsData.aws_secret_access_key
              }

              var username = user.user;
              var baseBucketName = awsData.aws_root_bucket;
              var directory = "/landers/" + stagingDir + "/";
              db.aws.s3.createDirectory(username, baseBucketName, directory, credentials, function(err) {
                if (err) {
                  callback(err);
                } else {

                  //3. copy the lander into the folder
                  db.aws.s3.copyDirFromStagingToS3(stagingPath, credentials, username, baseBucketName, directory, function(err) {
                    if (err) {
                      callback(err);
                    } else {

                      //4. remove the staging
                      me.deleteStagingArea(stagingPath, function(err) {

                        //5. save the new lander with the s3_folder_name as well TODO
                        landerData.s3_folder_name = stagingDir;
                        db.landers.saveNewLander(user, landerData, function(err, returnData) {
                          if(err){
                            callback(err);
                          } else {
                            callback(false, landerData);
                          }
                        });
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    },


    scrape: function(landerData, callback) {

      var url = landerData.lander_url;

      //create a staging area
      var stagingDir = uuid.v4();
      var stagingPath = "./staging/" + stagingDir;

      console.log("url: " + url);

      //scrape lander into staging area
      var options = {
        urls: [url],
        directory: stagingPath,
        subdirectories: [
          { directory: 'img', extensions: ['.jpg', '.png', '.svg'] },
          { directory: 'js', extensions: ['.js'] },
          { directory: 'css', extensions: ['.css'] }
        ],
        sources: [
          { selector: 'img', attr: 'src' },
          { selector: 'link[rel="stylesheet"]', attr: 'href' },
          { selector: 'script', attr: 'src' }
        ],
        request: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 4 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19'
          }
        }
      }

      scraper.scrape(options).then(function(result) {
        callback(false, stagingPath, stagingDir);
      }).catch(function(err) {
        callback(err);
      });
    },


    // createStagingArea: function(callback) {
    //   var error;
    //   var staging_dir = uuid.v4();

    //   var staging_path = "./staging/" + staging_dir;

    //   mkdirp(staging_path, function(err) {
    //     if (err) {
    //       callback(err);
    //       error = "Server error making staging directory."
    //     } else {
    //       callback(false, staging_path);
    //     }
    //   });
    // },

    deleteStagingArea: function(stagingPath, callback) {
      rimraf(stagingPath, function() {
        callback(false);
      });
    }


  };

  return module;

}
