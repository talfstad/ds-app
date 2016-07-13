module.exports = function() {

  var module = {};

  var CleanCSS = require('clean-css');
  var path = require('path');
  var purifyCss = require('purify-css');
  var cheerio = require('cheerio');
  var fs = require('fs');
  var criticalCss = require('critical');
  var htmlMinifier = require('html-minifier').minify;
  var yuiCompressor = require('yuicompressor');
  var imagemin = require('imagemin');
  var imageminMozjpeg = require('imagemin-mozjpeg');
  var imageminPngquant = require('imagemin-pngquant');
  var rimraf = require('rimraf');
  var find = require('find');
  var fs = require('fs');
  var cmd = require('node-cmd');


  //optimizer has an optimize function that takes an HTML file path, optimized file output path,
  module.fullyOptimize = function(stagingPath, callback) {

    //pass all html files over to optimize css
    find.file(/\.html$/, stagingPath, function(htmlFiles) {
      module.optimizeCss(htmlFiles, function(err) {
        if (err) {
          console.log("err: " + err);
        } else {
          console.log("done with css");
          module.optimizeJs(stagingPath, function(err) {
            if (err) {
              callback(err);
            } else {
              console.log("done with js");
              module.optimizeHtml(htmlFiles, function(err) {
                if (err) {
                  callback(err);
                } else {
                  console.log("done with html");
                  module.optimizeImages(stagingPath, function(err) {
                    if (err) {
                      callback(err);
                    } else {
                      console.log("done with images");
                      module.gzipStagingFiles(stagingPath, function(err) {
                        if (err) {
                          callback(err);
                        } else {
                          console.log("done gzipping");
                          callback(false, htmlFiles);
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  };


  //optimize Single HTML endpoint. not ideal for optimizing a whole directories worth
  //read all css files from endpoint into a string
  //concat them all into 1 string for yuicompressor
  //compress them all
  //write it to a file
  //purify that file
  //critical css that purified file
  //inline the critical stuff and async load the rest of the css
  module.optimizeCss = function(htmlFiles, callback) {

    //don't pass any tmp html files into here ! somehow filename is using tmp for the CSS? ? ?!

    for (var i = 0; i < htmlFiles.length; i++) {
      var fullHtmlFilePath = htmlFiles[i];
      var fullHtmlFileDirPath = path.dirname(fullHtmlFilePath);
      var fileName = path.basename(fullHtmlFilePath);

      //read file in as a string
      var cssFiles = [];
      fs.readFile(fullHtmlFilePath, function(err, fileData) {
        if (err) {
          callback(err);
        } else {

          var $ = cheerio.load(fileData);

          // get all the href's to minimize from the html file
          $('link[rel="stylesheet"]').each(function(i, link) {
            var href = $(this).attr("href");
            // href = href.replace(/^\//, "");
            cssFiles.push(href);
            $(this).remove();
          });

          //fix up the html endpoint file with our new CSS
          $('<link rel="stylesheet" type="text/css" href="' + fileName + '.css">').appendTo('head');

          //with list of relative or absolute css files use clean css to combine them
          //and rewrite the urls
          var data = cssFiles
            .map(function(cssFilename) {
              return '@import url(' + cssFilename + ');';
            })
            .join('');

          new CleanCSS({
            root: fullHtmlFileDirPath
          }).minify(data, function(error, minified) {
            if (error)
              throw error;

            var styles = minified.styles;

            var purifyOptions = {
              minify: true
            };

            purifyCss($.html(), styles, purifyOptions, function(purifiedAndMinifiedResult) {

              var outputCssFile = fullHtmlFilePath + ".css";

              fs.writeFile(outputCssFile, purifiedAndMinifiedResult, function(err) {
                if (err) {
                  callback(err);
                } else {
                  //now extract out the above the fold css!
                  criticalCss.generate({
                    extract: true,
                    base: fullHtmlFileDirPath,
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
  }


  //read in each html file, extract all script tags that aren't
  //with class "js-snippet" and combine them and minify them and insert them into 
  //bottom of lander.
  //localize remote scripts
  module.optimizeJs = function(stagingPath, callback) {

    //- get all the js files in the staging path
    find.file(/\.js$/, stagingPath, function(files) {

      //- loop through them all keep an async index count
      var asyncIndex = 0;
      for (var i = 0; i < files.length; i++) {
        //- on loop compress
        yuiCompressor.compress(files[i], {
          charset: 'utf8',
          type: 'js',
          nomunge: true,
          'line-break': 80
        }, function(err, compressedFile, extra) {
          if (err) {
            callback(err);
          } else {
            //- and overwrite the file
            fs.writeFile(files[asyncIndex], compressedFile, function(err) {
              if (++asyncIndex == files.length) {
                //- callback when done                
                callback(false);
              }
            });
          }
        });
      }
    });
  };


  module.optimizeHtml = function(htmlFiles, callback) {
    var asyncIndex = 0;
    for (var i = 0; i < htmlFiles.length; i++) {
      var htmlFile = htmlFiles[i];


      var readHtmlFile = function(htmlFile, callback) {
        fs.readFile(htmlFile, 'utf8', function(err, file) {
          if (err) {
            callback(err);
          } else {
            callback(file);
          }
        });
      };

      readHtmlFile(htmlFile, function(file) {
        var minifiedFile = htmlMinifier(file, {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          collapseInlineTagWhitespace: true,
          conservativeCollapse: true,
          removeComments: true,
          caseSensitive: true,
          minifyCSS: true,
          minifyJS: true,
          removeEmptyAttributes: true
        });
        fs.writeFile(htmlFiles[asyncIndex], minifiedFile, function(err) {
          if (++asyncIndex == htmlFiles.length) {
            //- callback when done                
            callback(false);
          }
        });
      });
    }
  };

  //NEEDS LIBPNG
  module.optimizeImages = function(stagingPath, callback) {

    //lossless image compression
    find.file(/\.jpg$|\.png$/, stagingPath, function(images) {

      imagemin(images, {
        plugins: [
          imageminMozjpeg({ targa: false }),
          imageminPngquant({ quality: '65-80' })
        ]
      }).then(function(compressedImages) {

        //overwrite the original images with the optimized images
        var asyncIndex = 0;
        for (var i = 0; i < images.length; i++) {

          var destImagePath = images[i];
          var compressedImage = compressedImages[i];

          //copy it to the destImagePath
          fs.writeFile(destImagePath, compressedImage.data, function(err) {
            if (err) {
              callback(err);
            } else {
              if (++asyncIndex == images.length) {
                callback(false);
              }
            }
          });
        }
      }, function(err) {
        callback(err);
      });
    });
  };

  module.gzipStagingFiles = function(stagingPath, callback) {
    cmd.get('gzip -9r ' + stagingPath, function(data) {
      find.file(/\.gz$/, stagingPath, function(gzippedFiles) {
        var asyncIndex = 0;
        for (var i = 0; i < gzippedFiles.length; i++) {
          var newName = gzippedFiles[i].replace(/.gz$/, '');
          fs.rename(gzippedFiles[i], newName, function(err) {
            if (err) {
              callback(err);
            } else {
              if (++asyncIndex == gzippedFiles.length) {
                callback(false);
              }
            }
          });
        }
      });
    });
  };

  return module;

};
