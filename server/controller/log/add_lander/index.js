module.exports = function(app, dbApi, awsApi) {
  
  var path = require("path");
  var fs = require("fs");
  
  var module = _.extend({

    pushBadLanderToS3: function(user, zipPath, callback) {
      //push the bad lander to buildcave's s3 add lander error bucket
      var filename = path.basename(zipPath);
      var key = "add_lander_errors/" + user.user + "/" + filename;
      
      fs.readFile(zipPath, function(err, body) {
        var lander_id = false; //just to show the put option args
        awsApi.s3.putObject(lander_id, app.config.aws.s3Credentials, app.config.aws.bucketName, key, body, function(err, data) {
          var s3DownloadUrl = user.user + "/" + filename;
          callback(err, s3DownloadUrl);
        });
      });
    }
    
  }, {});

  return module;
};