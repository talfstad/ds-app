module.exports = function(app, dbApi, controller) {

  var module = {};
  var uuid = require("uuid");
  var scraper = require('../../node_modules_custom/website-scraper');
  // var scraper = require('website-scraper');
  var fs = require('fs');
  var mkpath = require('mkpath');
  var path = require('path');
  var find = require('find');
  var cheerio = require('cheerio');
  var url_parser = require('url');
  var request = require('request');

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
      created_on: attr.lander_created_on,
      browser: attr.browser,
      depth: attr.depth
    };

    module.scrape(landerData, function(err, stagingPath, stagingDir, urlEndpoint) {
      var cleanupAndError = function(err) {
        dbApi.log.rip.error(err, user, stagingDir, landerData, function(err) {
          dbApi.landers.deleteLander(user, lander_id, function(deleteLanderErr) {
            if (deleteLanderErr) {
              callback(deleteLanderErr, [myJobId]);
            } else {
              callback(err, [myJobId]);
            }
          });
        });
        //this return makes sure this job is stopped immediately when the callback is run
        //TODO test this
        return;
      };

      controller.jobs.watchDog(user, myJobId);

      if (err) {
        cleanupAndError(err);
      } else {

        dbApi.jobs.updateDeployStatus(user, myJobId, 'initializing:rip_optimizing', function(err) {
          if (err) {
            cleanupAndError(err);
          } else {

            app.log("staging: " + stagingDir + " " + stagingPath, "debug");

            dbApi.landers.addS3FolderDeploymentFolderToLander(user, lander_id, stagingDir, function(err) {
              if (err) {
                cleanupAndError(err);
              } else {

                var options = {
                  deleteStaging: true,
                  endpoint: urlEndpoint,
                  depth: landerData.depth,
                  jobId: myJobId
                };

                //rip and add lander both call this to finish the add lander process           
                controller.landers.add.optimizePushSave(options, user, stagingPath, stagingDir, landerData, function(err, data) {
                  if (err) {
                    cleanupAndError(err);
                  } else {
                    dbApi.jobs.updateDeployStatus(user, myJobId, 'not_deployed', function(err) {
                      if (err) {
                        cleanupAndError(err);
                      } else {
                        dbApi.jobs.checkIfExternalInterrupt(user, myJobId, function(err, interruptCode) {
                          if (interruptCode) {
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
  };

  module.scrape = function(landerData, callback) {

    var url = landerData.lander_url;
    var depth = landerData.depth;
    var browser = landerData.browser;

    //default mobile
    var userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1";
    if (browser == "desktop") {
      app.log("ripping desktop version", "debug");
      userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36";
    }

    var host = url_parser.parse(url).host;
    host = host.replace('www.', '');
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
      // subdirectories: [{
      //   directory: 'images',
      //   extensions: ['.png', '.jpg', '.jpeg', '.gif']
      // }, {
      //   directory: 'js',
      //   extensions: ['.js']
      // }, {
      //   directory: 'videos',
      //   extensions: ['.mp4']
      // }, {
      //   directory: 'css',
      //   extensions: ['.css']
      // }, {
      //   directory: 'fonts',
      //   extensions: ['.ttf', '.woff', '.eot', '.svg']
      // }],
      recursive: (depth > 0 && depth < 3 ? true : false),
      urlFilter: function(url) {
        //if our base url to rip is in the url return true
        return (url.includes(host));
      },
      filenameGenerator: 'bySiteStructure',
      directory: stagingPath,
      request: {
        headers: {
          'User-Agent': userAgent
        }
      }
    };

    if (options.recursive) {
      //rip depth can only be 0 or 1 or 2
      if (depth > 0 && depth < 3) {
        options.maxDepth = depth;
      } else {
        options.maxDepth = 0;
      }
      app.log("ripping recursively to depth = " + depth, "debug");
    }

    scraper.scrape(options).then(function(result) {
      var filename = result[0].filename.replace(/^\//, ''); //if we have a php endpoint replace
      console.log("urlEndpoint: " + filename);

      //find all html files, map them to original url and get the resource.
      var getResourcesInJs = function(callback) {


        var isExternal = function(href) {
          return /(^\/\/)|(:\/\/)/.test(href);
        };

        var getResourcesFromHtml = function(callback) {
          var getResourcesFromJsInHtmlUpdatePath = function(files, callback) {

            var requestFile = function(url, saveTo, callback) {
              //get all js from html files and return it as a big string
              var requestOptions = {
                encoding: 'binary',
                strictSSL: false,
                jar: true,
                gzip: true
              };
              request(url, requestOptions, function(err, response, body) {
                //create dir if not exist
                fs.writeFileSync(saveTo, body, { encoding: 'binary' });
                callback();
              });
            };

            var createDirIfNotExist = function(filepath, callback) {
              mkpath(path.dirname(filepath), function(err) {
                callback();
              });
            };

            var getResourcesForFile = function(file, callback) {
              var $ = cheerio.load(fs.readFileSync(file));
              $("script").each(function(idx, el) {
                if (!$(this).attr("src")) {
                  var jsString = $(this).text();
                  var matches = jsString.match(/[\"|\'][\/a-zA-Z0-9%]+(\.jpg|\.png|\.gif)+[\'$|\"$]/g);
                  var matchesIdx = 0;
                  _.each(matches, function(resource) {
                    var resourceString = resource.replace(/^\'|^\"/, '').replace(/\'$|\"$/, '');

                    var parsedUrl = url_parser.parse(url);
                    var baseUrl = url.replace(parsedUrl.path, '').replace(/\#$/, '');
                    var dirname = path.dirname(file).replace(stagingPath, '');
                    var urlToGet = baseUrl + dirname + resourceString;
                    var saveTo = stagingPath + dirname + resourceString //save to path

                    if (/^\//.test(resourceString)) {
                      //change to web root path
                      urlToGet = baseUrl + resourceString;
                      saveTo = stagingPath + resourceString;
                    }

                    app.log('saveTo: ' + saveTo, "debug");
                    app.log('url to get: ' + urlToGet, "debug");

                    //update jsString path
                    // console.log("TREVY: " + jsString + " : "  + resourceString + " : " + resourceString.replace(/^\//,''))
                    jsString = jsString.replace(resourceString, resourceString.replace(/^\//, ''));

                    console.log("fixed path: " + jsString);

                    //create the directory to receive the file
                    createDirIfNotExist(saveTo, function() {
                      //get the file
                      requestFile(urlToGet, saveTo, function(fileData) {
                        //make the path relative
                        //update jsString

                        if (++matchesIdx == matches.length) {
                          $(this).text(jsString); //set with updated relative paths

                          //write this file back with new paths
                          fs.writeFileSync(file, $.html());
                          callback();
                        }
                      });
                    });

                  });
                }
              });
            };

            var fileIdx = 0;
            _.each(files, function(file) {
              getResourcesForFile(file, function() {

                if (++fileIdx == files.length) {
                  //done with all files
                  callback();
                }
              });


            });
          };


          find.file(/\.html$|\.php$/, stagingPath, function(files) {
            getResourcesFromJsInHtmlUpdatePath(files, function(resources) {
              console.log("called back resources: " + JSON.stringify(resources));
              callback();
            });
          });
        };
        var getResourcesFromJs = function(callback) {
          var concatAllJs = function(callback) {
            var jsString = "";
            callback(jsString);
          };
          callback();
        };

        getResourcesFromHtml(function() {
          getResourcesFromJs(function() {
            callback();
          });
        });
      };


      // getResourcesInJs(function() {
      callback(false, stagingPath, stagingDir, filename);
      // });


    }).catch(function(err) {
      callback(err);
    });
  };

  return module.ripLander;

};
