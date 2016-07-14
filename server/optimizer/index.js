module.exports = function(app) {

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
    if (!app.config.optimize.images) {
      console.log("ALERT: not optimizing images");
      callback(false);
    } else {

      var optimizeJpg = function(callback) {
        find.file(/\.jpg$|\.jpeg$/, stagingPath, function(jpgImages) {
          var asyncIndex = 0;
          for (var i = 0; i < jpgImages.length; i++) {
            var image = jpgImages[i];
            //jpegtran -copy none -optimize -outfile pic4.jpg pic4.jpg
            cmd.get('jpegtran -copy none -optimize -outfile ' + image + ' ' + image, function() {
              if (++asyncIndex == jpgImages.length) {
                callback(false);
              }
            });
          }
          if (jpgImages.length <= 0) {
            callback(false);
          }
        });
      }

      var optimizeGif = function(callback) {
        find.file(/\.gif$/, stagingPath, function(gifImages) {
          var asyncIndex = 0;
          for (var i = 0; i < gifImages.length; i++) {
            var image = gifImages[i];
            //gifsicle Door_03_Artists.gif -o Door_03_Artists.gif.opt
            cmd.get('gifsicle ' + image + ' -o ' + image, function() {
              if (++asyncIndex == gifImages.length) {
                callback(false);
              }
            });
          }
          if (gifImages.length <= 0) {
            callback(false);
          }
        });
      }

      var optimizePng = function(callback) {
        find.file(/\.png$/, stagingPath, function(pngImages) {
          var asyncIndex = 0;
          for (var i = 0; i < pngImages.length; i++) {
            var image = pngImages[i];
            cmd.get('pngcrush ' + image + ' ' + image + ' &> /dev/null', function() {
              if (++asyncIndex == pngImages.length) {
                callback(false);
              }
            });
          }
          if (pngImages.length <= 0) {
            callback(false);
          }
        });
      }

      optimizePng(function() {
        optimizeJpg(function() {
          optimizeGif(function() {
            callback(false);
          });
        });
      });
    }
  };

  module.gzipStagingFiles = function(stagingPath, callback) {

    var renameFile = function(file, callback) {
      var newName = file.replace(/.gz$/, '');
      var ext = newName.split('.').pop();

      if (app.config.noGzipArr.indexOf(ext) <= -1) { //new name ext = excluded extensions don't rename!
        fs.rename(file, newName, function(err) {
          if (err) {
            callback(err);
          } else {
            callback(false);
          }
        });
      } else {
        //uncompress the gz version of the file
        cmd.get('gzip --uncompress ' + file, function(data) {
          callback(false);
        });
      }
    };

    cmd.get('gzip -9r ' + stagingPath, function(data) {
      find.file(/\.gz$/, stagingPath, function(gzippedFiles) {
        var asyncIndex = 0;
        for (var i = 0; i < gzippedFiles.length; i++) {
          renameFile(gzippedFiles[i], function(err) {
            if (++asyncIndex == gzippedFiles.length) {
              callback(false);
            }
          });
        }
      });
    });
  };

  return module;

};
