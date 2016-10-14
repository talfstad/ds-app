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
var zipFolder = require('zip-dir');
var find = require('find');
var yuicompressor = require('yuicompressor');
var CleanCSS = require('clean-css');
var path = require('path');
var purifyCss = require('purify-css');
var cheerio = require('cheerio');
var fs = require('fs');
var critcialCss = require('critical');
var nodecp = require('node-cp');

//optimize Single HTML endpoint. not ideal for optimizing a whole directories worth
var optimizeCss = function(options, callback) {

  //relative paths from staging_path
  var htmlFilePath = options.htmlFilePath;
  var webBasePath = options.webBasePath || '/';

  //absolute path to staging directory or possibly relative path
  var stagingPath = options.stagingPath || process.cwd();

  var fullHtmlFilePath = path.join(stagingPath, htmlFilePath);
  var fullWebBasePath = path.join(stagingPath, webBasePath);

  var content = options.content || htmlFilePath;

  if (!htmlFilePath) {
    console.log("Cannot optimize unless you have a html path !!");
    return;
  }

  //read file in as a string
  var cssFiles = [];
  fs.readFile(fullHtmlFilePath, function(err, fileData) {
    if (err) {
      console.log("error: " + err);
    } else {

      var $ = cheerio.load(fileData);

      // get all the href's to minimize from the html file
      $('link[rel="stylesheet"]').each(function(i, link) {
        var href = $(this).attr("href");
        // href = href.replace(/^\//, "");
        cssFiles.push(href);
        $(this).remove();
      });

      //with list of relative or absolute css files use clean css to combine them
      //and rewrite the urls
      var data = cssFiles
        .map(function(filename) {
          console.log("filename: " + filename);
          return '@import url(' + filename + ');';
        })
        .join('');

      new CleanCSS({
        root: fullWebBasePath
      }).minify(data, function(error, minified) {
        if (error)
          throw error;

        var styles = minified.styles;

        var purifyOptions = {
          minify: true
        };

        purifyCss(content, styles, purifyOptions, function(purifiedAndMinifiedResult) {

          var outputCssFile = path.join(fullWebBasePath, "style.css");

          fs.writeFile(outputCssFile, purifiedAndMinifiedResult, function(err) {
            if (err) {
              console.log("err: " + err);
            } else {

              //fix up the html endpoint file with our new CSS
              $('<link rel="stylesheet" type="text/css" href="/style.css">').appendTo('head');


              // fs.writeFile(fullHtmlFilePath, $.html(), function(err) {
              //   console.log("wrote index html: " + fullHtmlFilePath);
              //   callback(false);
              // });

              //now extract out the above the fold css!
              critcialCss.generate({
                extract: true,
                base: stagingPath,
                html: $.html(),
                css: [outputCssFile],
                dest: fullHtmlFilePath,
                minify: true,
                inline: true,
                ignore: ['@font-face', /url\(/]
              }, function(err, output) {
                if (err) {
                  callback(err);
                } else {
                  callback(false);
                }
              });
            }
          });
        });
      });
    }
  });
}


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
          .exclude(['node_modules_custom/website-scraper/node_modules', 'built', 'built.zip', 'node_modules', '.ebignore', 'server/staging', '.elasticbeanstalk', 'CONFIG', '.jsbeautifyrc', '.gitignore', '.git', '.gitattributes', 'build_scripts'])
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
                stagingPath: process.cwd(),
                htmlFilePath: 'built/server/index.html',
                webBasePath: 'built/public',
                content: [] // set below
              }

              //find all the content
              find.file(/\.js$/, htmlOptimizeOptions.webBasePath + "/assets/js/apps", function(jsFiles) {
                find.file(/\.tpl$/, htmlOptimizeOptions.webBasePath, function(tplFiles) {
                  tplFiles.push('built/server/index.html');
                  tplFiles.push('built/public/assets/js/require_main.js');
                  htmlOptimizeOptions.content = tplFiles.concat(jsFiles);

                  optimizeCss(htmlOptimizeOptions, function() {
                    //copy necessary files to dist
                    mkdirp('built/dist/public/assets/js', function(err) {
                      mkdirp('built/dist/public/vendor/bower_installed/summernote/dist', function(err) {
                        mkdirp('built/dist/.ebextensions', function(err) {

                          var copy = function(source, dest, callback) {
                            nodecp(source, dest, function(err, files) {
                              callback(err, files);
                            });
                          };

                          copy('built/server', 'built/dist/server', function(err, files) {
                            copy('built/Dockerfile', 'built/dist', function(err, files) {
                              copy('built/Dockerrun.aws.json', 'built/dist', function(err, files) {
                                copy('built/public/style.css', 'built/dist/public', function(err, files) {
                                  copy('built/package.json', 'built/dist', function(err, files) {
                                    copy('built/.ebextensions', 'built/dist/.ebextensions', function(err, files) {
                                      copy('built/node_modules_custom', 'built/dist/node_modules_custom', function(err, files) {
                                        copy('built/public/vendor/bower_installed/requirejs', 'built/dist/public/vendor/bower_installed/requirejs', function(err, files) {
                                          copy('built/public/vendor/bower_installed/summernote/dist/font', 'built/dist/public/vendor/bower_installed/summernote/dist/font', function(err, files) {
                                            copy('built/public/assets/fonts', 'built/dist/public/assets/fonts', function(err, files) {
                                              copy('built/public/assets/img', "built/dist/public/assets/img", function(err, files) {
                                                copy('built/public/assets/js/require_main.js', "built/dist/public/assets/js", function(err, files) {
                                                  //zip the archive for deployment
                                                  zipFolder('built/dist', { saveTo: 'built.zip' }, function(err) {
                                                    if (err) {
                                                      console.log("err: " + err);
                                                    } else {
                                                      console.log("build finished.")
                                                    }
                                                  });
                                                });
                                              });
                                            });
                                          });
                                        });
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
      }
    });
  }
});
