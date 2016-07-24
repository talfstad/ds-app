module.exports = function(app, passport) {

  var Puid = require('puid');
  var db = require("../../db_api")(app);

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
          //rip and add lander both call this to finish the add lander process           
          db.landers.common.add_lander.addOptimizePushSave(user, stagingPath, stagingDir, landerData, function(err, data) {
            if (err) {
              db.log.rip.error(err, user, stagingDir, landerData, function(err) {
                //callback to user that we logged the error and are going to help figure it out
                callback({code: "ErrorRippingLander"});
              });
            } else {
              callback(false, data);
            }
          });
        }
      });
    },

    scrape: function(landerData, callback) {

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
