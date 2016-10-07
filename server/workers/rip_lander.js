module.exports = function(app, db) {

  var module = {};
  var uuid = require("uuid");
  var scraper = require('../../node_modules_custom/website-scraper');
  var fs = require('fs');
  var path = require('path');
  var find = require('find');
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

        var removeQueryAttributes = function(callback) {
          find.file(/\.html/, stagingPath, function(htmlFiles) {
            _.each(htmlFiles, function(htmlFile) {
              var correctedFilename = htmlFile.replace(/\?.*/g, ''); //remove from ? to end of url
              fs.renameSync(htmlFile, correctedFilename);
            });
            callback(false);
          });
        };

        removeQueryAttributes(function() {
          db.jobs.updateDeployStatus(user, myJobId, 'initializing:rip_optimizing', function(err) {
            if (err) {
              cleanupAndError(err);
            } else {

              app.log("staging: " + stagingDir + " " + stagingPath, "debug");

              db.landers.addS3FolderDeploymentFolderToLander(user, lander_id, stagingDir, function(err) {
                if (err) {
                  cleanupAndError(err);
                } else {

                  var options = {
                    deleteStaging: true,
                    endpoint: urlEndpoint,
                    depth: landerData.depth
                  };

                  //rip and add lander both call this to finish the add lander process           
                  db.landers.common.add_lander.addOptimizePushSave(options, user, stagingPath, stagingDir, landerData, function(err, data) {
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
                }
              });
            }
          });
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
      recursive: (depth > 0 && depth < 3 ? true : false),
      urlFilter: function(url) {
        //if our base url to rip is in the url return true
        return (url.includes(host));
      },
      filenameGenerator: 'bySiteStructure', //need this incase of javascript dynamic image specification, etc.
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
        options.maxDepth = depth
      } else {
        options.maxDepth = 0;
      }
      app.log("ripping recursively to depth = " + depth, "debug");
    }

    var requestOptions = {
      encoding: 'binary',
      strictSSL: false,
      jar: true,
      gzip: true,
      headers: {
        'User-Agent': userAgent
      }
    };

    scraper.scrape(options).then(function(result) {
      // console.log("RESULT: " + JSON.stringify(result))
      var urlEndpoint = { filename: result[0].filename };

      //find all html files, map them to original url and get the resource.
      find.file(/\.html$|\.php$/, stagingPath, function(files) {
        var urlParsed = url_parser.parse(url);
        var urlBase = url.replace(urlParsed.path, ''); //replaces path + search

        var idx = 0;
        _.each(files, function(file) {
          //replace the scraped resource with the original

          var urlToGet = urlBase + file.replace(stagingPath, '');
          
          //if the url is a / url with no endpoint, make the urlToGet be / if its
          //filename is equal to the defaultFilename (index.html)
          if (url.replace(urlParsed.search, '') == urlToGet.replace('index.html', '')) {
            urlToGet = url; //get the original
          }

          var getRequest = function(file, gettingUrl, callback) {
            // get the original html files and rewrite them
            request(gettingUrl, requestOptions, function(err, response, body) {
              fs.writeFileSync(file, body);
              callback();
            });
          };

          getRequest(file, urlToGet, function() {
            if (++idx == files.length) {
              console.log("replaced all files");
              callback(false, stagingPath, stagingDir, urlEndpoint.filename);
            }
          });
        });
      });
    }).catch(function(err) {
      callback(err);
    });
  };

  return module.ripLander;

};
