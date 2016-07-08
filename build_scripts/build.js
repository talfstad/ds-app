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
var find = require('find');
var purifycss = require('purifycss');
var yuicompressor = require('yuicompressor');
var htmlEndpointOptimizer = require('../server/optimizer');

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

              var htmlOptimizeOptions = {
                htmlFilePath: 'built/server/index.html',
                webBasePath: 'built/public',
                outputFilePath: 'built/public/style.css',
                content: []
              }

              //find all the content
              find.file(/\.js$/, htmlOptimizeOptions.webBasePath + "/assets/js/apps", function(jsFiles) {
                console.log("js files: " + jsFiles.length);
                find.file(/\.tpl$/, htmlOptimizeOptions.webBasePath, function(tplFiles) {
                  tplFiles.push('built/server/index.html');
                  tplFiles.push('built/public/assets/js/require_main.js');
                  htmlOptimizeOptions.content = tplFiles.concat(jsFiles);

                  htmlEndpointOptimizer.optimizeHtmlFile(htmlOptimizeOptions, function() {
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
              });


              // var cssFiles = ['https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700',
              //   'built/public/vendor/jquery/jquery_ui/jquery-ui.min.css',
              //   'built/public/vendor/bower_installed/datatables/media/css/dataTables.bootstrap.min.css',
              //   "built/public/assets/skin/default_skin/css/theme.min.css",
              //   "built/public/assets/admin-tools/admin-forms/css/admin-forms.css",
              //   "built/public/vendor/plugins/fancytree/skin-win8/ui.fancytree.min.css",
              //   "built/public/vendor/bower_installed/select2/dist/css/select2.css",
              //   "built/public/vendor/bower_installed/codemirror/lib/codemirror.css",
              //   "built/public/vendor/bower_installed/bootstrap-fileinput/css/fileinput.min.css",
              //   "built/public/vendor/bower_installed/fancybox/source/jquery.fancybox.css",
              //   "built/public/assets/skin/overrides/login_overrides.css",
              //   "built/public/assets/skin/overrides/landers_overrides.css",
              //   "built/public/assets/skin/overrides/domains_overrides.css",
              //   "built/public/assets/skin/overrides/campaigns_overrides.css",
              //   "built/public/assets/skin/overrides/active_snippets_overrides.css",
              //   "built/public/assets/skin/overrides/overrides.css"
              // ]

              // content = ['built/public/assets/js/require_main.js', 'built/server/index.html'];


              // //read all css files from endpoint into a string

              // //compress them all

              // //write it to a file

              // //purify that file

              // //critical css that purified file

              // //inline the critical stuff and async load the rest



              // //1. purify css into 1 minified output file
              // console.log("here!")

              // yuicompressor.compress("built/public/assets/skin/overrides/*.css", {
              //   //Compressor Options: 
              //   charset: 'utf8',
              //   type: 'css',
              //   outfile: 'built/public/assets/skin/style.min.css',
              //   'line-break': 80
              // }, function(err, data, extra) {
              //   if (err) {
              //     console.log("error: " + err);
              //   } else {
              //     console.log("data: " + data);
              //   }

              //   //err   If compressor encounters an error, it's stderr will be here 
              //   //data  The compressed string, you write it out where you want it 
              //   //extra The stderr (warnings are printed here in case you want to echo them 




              //   // var purifyOptions = {
              //   //   output: 'built/public/assets/skin/style.css',
              //   //   minify: true,
              //   //   silent: true
              //   // };
              //   // purifycss(content, cssFiles, purifyOptions);


              // });




              //zip the archive for deployment
              // zipFolder('built', 'built.zip', function(err) {
              //   if (err) {
              //     console.log("err: " + err);
              //   } else {
              //     console.log("build finished.")
              //   }
              // });





              //2. inline the critical css in the index.html file

              //3. update the index.html to async load the css file (rest of it)

            });
          });
      }
    });
  }
});
