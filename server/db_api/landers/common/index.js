module.exports = function(app, db) {

  var module = {};

  module.add_lander = require('./add_lander')(app, db);

  module.unGzipAllFilesInStaging = function(staging_path, callback) {
    var find = require('find');
    var fs = require('fs');
    var cmd = require('node-cmd');

    var unGzipFile = function(file, callback) {
      var ext = file.split('.').pop();

      if (app.config.noGzipArr.indexOf(ext) <= -1) {
        //first rename it
        var gzippedFile = file + ".gz";
        fs.rename(file, gzippedFile, function(err) {
          //-N restore original name, -f force overwrite, decompress, -S use suffix
          //gzip -N -d -f -S .html index.html
          cmd.get("nice gzip -c -d " + gzippedFile + " > " + file, function(data) {
            //delete the gzipped version
            fs.unlink(gzippedFile, function() {
              callback(false);
            });
          });
        });
      } else {
        callback(false);
      }
    }

    //2. UNGZIP!
    find.file(staging_path, function(files) {
      var asyncIndex = 0;
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        unGzipFile(file, function() {
          if (++asyncIndex == files.length) {
          	callback(false);
          }
        })
      }
    });

  };

  return module;

}
