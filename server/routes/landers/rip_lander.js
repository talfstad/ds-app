module.exports = function(app, passport) {

  var config = require("../../config");
  var Puid = require('puid');
  var db = require("../../db_api");

  var mkdirp = require("mkdirp");
  var rimraf = require("rimraf");
  var uuid = require("uuid");

  var scraper = require('website-scraper');

  var module = {

    new: function(user, landerData, callback) {

      var me = this;

      //1. rip the lander and its resources into staging
      this.scrape(landerData, function(err, stagingPath, stagingDir, urlEndpoint) {
        if (err) {
          callback(err);
        } else {

          landerData.urlEndpoints.push(urlEndpoint);
          landerData.s3_folder_name = stagingDir;
          landerData.deployment_folder_name = stagingDir;

          db.aws.keys.getAmazonApiKeysAndRootBucket(user, function(err, awsData) {
            if (err) {
              callback(err);
            } else {

              var username = user.user;
              var baseBucketName = awsData.aws_root_bucket;
              var directory = "/landers/" + stagingDir + "/";
              var fullDirectory = username + directory;

              var credentials = {
                accessKeyId: awsData.aws_access_key_id,
                secretAccessKey: awsData.aws_secret_access_key
              }

              db.aws.s3.createDirectory(username, baseBucketName, directory, credentials, function(err) {
                if (err) {
                  callback(err);
                } else {

                  //3. copy the lander into the folder
                  db.aws.s3.copyDirFromStagingToS3(stagingPath, credentials, username, baseBucketName, fullDirectory, function(err) {
                    if (err) {
                      callback(err);
                    } else {

                      //4. remove the staging
                      // db.common.deleteStagingArea(stagingPath, function(err) {
                        db.landers.saveNewLander(user, landerData, function(err, returnData) {
                          if (err) {
                            callback(err);
                          } else {
                            callback(false, landerData);
                          }
                        });
                      // });
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

      //scrape lander into staging area
      var options = {
        urls: [url],
        sources: [{
          selector: 'img',
          attr: 'src'
        }, {
          selector: 'input',
          attr: 'src'
        }, {
          selector: 'object',
          attr: 'data'
        }, {
          selector: 'embed',
          attr: 'src'
        }, {
          selector: 'video',
          attr: 'src'
        }, {
          selector: 'source',
          attr: 'src'
        }, {
          selector: 'param[name="movie"]',
          attr: 'value'
        }, {
          selector: 'script',
          attr: 'src'
        }, {
          selector: 'link[rel="stylesheet"]',
          attr: 'href'
        }, {
          selector: 'link[rel*="icon"]',
          attr: 'href'
        }],
        subdirectories: [{
          directory: 'images',
          extensions: ['.png', '.jpg', '.jpeg', '.gif']
        }, {
          directory: 'js',
          extensions: ['.js']
        }, {
          directory: 'videos',
          extensions: ['.mp4']
        }, {
          directory: 'css',
          extensions: ['.css']
        }, {
          directory: 'fonts',
          extensions: ['.ttf', '.woff', '.eot', '.svg']
        }],
        directory: stagingPath,
        request: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 4 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19'
          }
        }
      }

      scraper.scrape(options).then(function(result) {
        var urlEndpoint = { filename: result[0].filename };
        callback(false, stagingPath, stagingDir, urlEndpoint);
      }).catch(function(err) {
        callback(err);
      });
    }
  };

  return module;

}
