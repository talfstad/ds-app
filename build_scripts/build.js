/*

build.js - builds landerDS

1. creates a dest folder
2. copies project into it
3. runs r.js on it and overwrites original require.js file with built version

*/


var mkdirp = require('mkdirp');
//copy folder to other folder with good exclude functionality
var Rsync = require('rsync');
var requirejs = require('requirejs');


mkdirp('./dest', function(err) {
  if (err) {
    console.log(err);
  } else {

    //copy to dest folder
    var rsync = new Rsync()
      .source('.')
      .destination('dest')
      .exclude(['dest', '.gitignore', '.gitattributes', '.jsbeautifyrc', 'build_scripts'])
      .flags('a') //archive mode
      .execute(function(err, stdout, stderr) {

        //r.js compile !
        var config = {
          baseUrl: "dest/public",
          include: ["vendor/bower_installed/almond/almond", "assets/js/require_main"],
          mainConfigFile: "dest/public/assets/js/require_main.js",
          out: "dest/public/assets/js/require_main.js",
          wrapShim: true,
          preserveLicenseComments: false,
          findNestedDependencies: true
            // optimize: "none"
        };

        requirejs.optimize(config, function(buildResponse) {

          


        });






      });
  }
});
