module.exports = function(app, db) {

  var module = {};

  var uuid = require("uuid");
  var scraper = require('website-scraper');
  var fs = require('fs');
  var path = require('path');
  var find = require('find');


  module.ripLander = function(user, attr, callback) {

    var me = this;
    var myJobId = attr.id;
    var lander_id = attr.lander_id;
    var url = attr.lander_url;


    var landerData = {
      id: lander_id,
      name: attr.name,
      lander_url: url,
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

    module.scrape(landerData, function(err, stagingPath, stagingDir, urlEndpoint) {
      if (err) {
        cleanupAndError(err);
      } else {
        db.jobs.updateDeployStatus(user, myJobId, 'initializing:rip_optimizing', function(err) {
          if (err) {
            cleanupAndError(err);
          } else {

            app.log("staging: " + stagingDir + " " + stagingPath, "debug");

            db.landers.addS3FolderDeploymentFolderToLander(user, lander_id, stagingDir, function(err) {
              if (err) {
                cleanupAndError(err);
              } else {

                var removeNonIndexHtmlFiles = function(callback) {
                  //remove html files that aren't index.html since this is a rip
                  find.file(/\.html$/, stagingPath, function(htmlFilePaths) {
                    //create htmlFilesToDelete obj for saving
                    for (var i = 0; i < htmlFilePaths.length; i++) {
                      if (path.basename(htmlFilePaths[i]) != "index.html") {
                        app.log("deleting staging html file (because not index.html): " + htmlFilePaths[i], "debug");
                        fs.unlinkSync(htmlFilePaths[i]);
                      }
                    }
                    callback(false);
                  });
                }

                removeNonIndexHtmlFiles(function() {
                  var deleteStaging = true;
                  //rip and add lander both call this to finish the add lander process           
                  db.landers.common.add_lander.addOptimizePushSave(deleteStaging, user, stagingPath, stagingDir, landerData, function(err, data) {
                    if (err) {
                      db.log.rip.error(err, user, stagingDir, landerData, function(err) {
                        //callback to user that we logged the error and are going to help figure it out
                        cleanupAndError(err);
                      });
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
                });
              }
            });
          }
        });
      }
    });
  };

  module.scrape = function(landerData, callback) {

    var url = landerData.lander_url;

    //create a staging area
    var stagingDir = uuid.v4();
    var stagingPath = "staging/" + stagingDir;

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

    var findResourcesInFile = function(filepath, callback) {
      //parse this file and find any jpg, jpeg, png, gif resources
      // fs.readFile(filepath, function(err, fileData) {
      //   if (err) {
      //     callback({ code: "CouldNotReadFile", err: err });
      //   } else {

      //     //get all the paths from the javsacript file


      //     /* / <any> / <any> / <any> .jpg */
      //     var regex = /df/g;

      //     var matches = regex.exec(fileData);
      //     console.log("\n\n!! Matches : " + JSON.stringify(matches));

      //   }
      // });

      //see if resources were ripped


      //console log and test that we find the missing resources

      callback(false);
    };

    var getLostResources = function() {
      //search js files for resources not include and get them
      // find.file(/\.js$/, stagingPath, function(jsFiles) {
      //   var asyncIndex = 0;
      //   if (jsFiles.length > 0) {
      //     for (var i = 0; i < jsFiles.length; i++) {
      //       var image = jsFiles[i];
      //       //jpegtran -copy none -optimize -outfile pic4.jpg pic4.jpg
      //       findResourcesInFile(jsFiles[i], function(err) {
      //         if (++asyncIndex == jsFiles.length) {
      //           callback(false);
      //         }
      //       });
      //     }
      //   } else {
      //     callback(false);
      //   }
      // });
      callback(false);
    };

    scraper.scrape(options).then(function(result) {
      var urlEndpoint = { filename: result[0].filename };

      //get lost resources
      getLostResources(function(err) {
        if (err) {
          callback(err);
        } else {
          callback(false, stagingPath, stagingDir, urlEndpoint);
        }
      });
    }).catch(function(err) {
      callback(err);
    });
  };

  return module.ripLander;

};
