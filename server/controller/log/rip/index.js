module.exports = function(app, dbApi, awsApi) {

  var base = require("../../base")(app, dbApi);

  var path = require("path");
  var fs = require("fs");

  var module = _.extend({

    error: function(err, user, landerData, callback) {

      dbApi.log.rip.error(err, user, landerData, function(err) {
        if (err) {
          callback(err);
        } else {
         callback(false);
        }
      });
    }

  }, {});

  return module;
};
