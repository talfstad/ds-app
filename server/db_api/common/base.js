module.exports = function(app, db) {

  var uuid = require('uuid');
  var mkdirp = require('mkdirp');
  var rimraf = require('rimraf');

  return {

    createStagingArea: function(callback) {
      var error;
      var staging_dir = uuid.v4();

      var staging_path = "staging/" + staging_dir;

      mkdirp(staging_path, function(err) {
        if (err) {
          callback(err);
        } else {
          callback(false, staging_path, staging_dir);
        }
      });

    },

    deleteStagingArea: function(stagingPath, callback) {

      app.log('deleting staging area: ' + stagingPath, "debug");
      rimraf(stagingPath + "*", function() {
        callback(false);
      });
    }
  }
};