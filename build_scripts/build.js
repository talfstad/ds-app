/*

build.js - builds landerDS

1. creates a built folder
2. copies project into it
3. runs r.js on it and overwrites original require.js file with built version

*/

var mkdirp = require('mkdirp');
//copy folder to other folder with good exclude functionality
var Rsync = require('rsync');
var requirejs = require('requirejs');
var rimraf = require('rimraf');
var zipFolder = require('zip-folder');

//remove old built directory first
rimraf('./built', function(err) {
  if (err) {
    console.log("err: " + err);
  } else {

    //make it again
    mkdirp('./built', function(err) {
      if (err) {
        console.log("err: " + err);
      } else {
        //copy to dist folder
        var rsync = new Rsync()
          .source('.')
          .destination('built')
          .exclude(['built', 'built.zip', '.ebignore', 'server/staging', '.elasticbeanstalk', 'CONFIG', '.jsbeautifyrc', '.gitignore', '.git', '.gitattributes', 'build_scripts'])
          .flags('a') //archive mode
          .execute(function(err, stdout, stderr) {

            //r.js compile !
            var config = {
              baseUrl: "built/public",
              include: ["vendor/bower_installed/almond/almond", "assets/js/require_main"],
              mainConfigFile: "built/public/assets/js/require_main.js",
              out: "built/public/assets/js/require_main.js",
              wrapShim: true,
              preserveLicenseComments: false,
              findNestedDependencies: true
            };

            requirejs.optimize(config, function(buildResponse) {

              //zip the archive for deployment
              zipFolder('built', 'built.zip', function(err) {
                if (err) {
                  console.log("err: " + err);
                } else {
                  console.log("build finished.")
                }
              });
            });
          });
      }
    });
  }
});
