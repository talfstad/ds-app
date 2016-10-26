module.exports = function(app, dbApi, awsApi) {

  var path = require("path");
  var fs = require("fs");

  var downloadController = require("../../landers/download")(app, dbApi, awsApi);

  var module = _.extend({

    pushBadLanderToS3: function(user, zipPath, callback) {
      console.log("pushing to our s3: "  + zipPath);
      //push the bad lander to buildcave's s3 add lander error bucket
      var filename = path.basename(zipPath);
      var key = "add_lander_errors/" + user.user + "/" + filename;

      fs.readFile(zipPath, function(err, body) {
        if(err) console.log("111 : " + JSON.stringify(err));
        var lander_id = false; //just to show the put option args
        awsApi.s3.putObject(lander_id, app.config.aws.s3Credentials, app.config.aws.bucketName, key, body, function(err, data) {
          if (err) console.log(JSON.stringify(err));

          var s3DownloadUrl = user.user + "/" + filename;
          callback(err, s3DownloadUrl);
        });
      });
    },

    getBadLanderFromS3: function(user, lander_id, callback) {
      downloadController.original(user, lander_id, function(err, sourcePathZip) {
        callback(err, sourcePathZip);
      });
    }
  }, {});

  return module;
};
