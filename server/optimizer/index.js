module.exports = function(app) {

  var module = {};

  var CleanCSS = require('clean-css');
  var path = require('path');
  var purifyCss = require('purify-css');
  var cheerio = require('cheerio');
  var fs = require('fs');
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
    console.log("fully optimized called: " + stagingPath);

    //pass all html files over to optimize css
    find.file(/\.html$/, stagingPath, function(htmlFiles) {
      module.optimizeCss(htmlFiles, function(err) {
        if (err) {
          console.log("err: " + err);
          callback(err);
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


  //read all css files from endpoint into a string
  //concat them all into 1 string for yuicompressor
  //compress them all
  //write it to a file
  //purify that file
  //critical css that purified file
  //inline the critical stuff and async load the rest of the css
  module.optimizeCss = function(htmlFiles, callback) {

    var purifyAndCriticalCssFile = function(fullHtmlFilePath, html, styles, callback) {
      var fullHtmlFileDirPath = path.dirname(fullHtmlFilePath);
      var fileName = path.basename(fullHtmlFilePath);

      var purifyOptions = {
        minify: true
      };

      purifyCss(html, styles, purifyOptions, function(purifiedAndMinifiedResult) {
        var outputCssFile = path.join(fullHtmlFileDirPath, fileName + ".css");

        fs.writeFile(fullHtmlFilePath, html, function(err) {
          if (err) {
            callback(err);
          } else {
            fs.writeFile(outputCssFile, purifiedAndMinifiedResult, function(err) {
              if (err) {
                callback(err);
              } else {
                //args htmlFilePath, cssOutputFile
                //runs in its own thread so it will clean up its stupid ass tmp files
                cmd.get("node ./optimizer/critical_css_thread " + fullHtmlFilePath + " " + outputCssFile + " " + fileName, function(output) {
                  // console.log("node output: " + output);
                  callback(false);
                });
              }
            });
          }
        });
      });
    }

    var optimizeCssFile = function(fullHtmlFilePath, fileData, callback) {
      //set to the async
      var fullHtmlFileDirPath = path.dirname(fullHtmlFilePath);
      var fileName = path.basename(fullHtmlFilePath);

      var $ = cheerio.load(fileData);

      // get all the href's to minimize from the html file
      $('link[rel="stylesheet"]').each(function(i, link) {
        var href = $(this).attr("href");
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
        if (error) {
          callback(err);
        } else {
          var styles = minified.styles;
          callback(false, $.html(), styles);
        }
      });
    }

    var readFile = function(filePath, callback) {
      fs.readFile(filePath, function(err, fileData) {
        if (err) {
          callback(err);
        } else {
          callback(false, filePath, fileData);
        }
      });
    };

    //don't pass any tmp html files into here ! somehow filename is using tmp for the CSS? ? ?!
    var asyncIndex = 0;
    for (var i = 0; i < htmlFiles.length; i++) {

      //read file in as a string
      var cssFiles = [];
      readFile(htmlFiles[i], function(err, filePath, fileData) {
        if (err) {
          callback(err);
        } else {
          optimizeCssFile(filePath, fileData, function(err, html, styles) {
            if (err) {
              callback(err);
            } else {
              purifyAndCriticalCssFile(filePath, html, styles, function(err) {
                if (err) {
                  callback(err);
                } else {
                  if (++asyncIndex == htmlFiles.length) {
                    callback(false);
                  }
                }

              });
            }
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
    if (htmlFiles.length <= 0) {
      callback(false);
      return;
    }

    var readHtmlFile = function(htmlFile, callback) {
      fs.readFile(htmlFile, 'utf8', function(err, fileData) {
        if (err) {
          callback(err);
        } else {
          callback(false, htmlFile, fileData);
        }
      });
    };

    var minifyHtmlFile = function(filePath, fileData, callback) {
      try {
        var minifiedFile = htmlMinifier(fileData, {
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

        fs.writeFile(filePath, minifiedFile, function(err) {
          callback(false);
        });
      } catch (err) {
        // console.log("err minify html, probably parse error ...");
        callback(false); //callback false because we just want to keep chugging html files
      }
    };

    var asyncIndex = 0;
    for (var i = 0; i < htmlFiles.length; i++) {

      readHtmlFile(htmlFiles[i], function(err, filePath, fileData) {
        if (err) {
          callback(err);
        } else {
          console.log("minifying html for: " + filePath);
          minifyHtmlFile(filePath, fileData, function(err) {
            //ignore error, just dont do anything
            if (++asyncIndex == htmlFiles.length) {
              callback(false);
            }
          });
        }

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
            cmd.get('nice jpegtran -copy none -optimize -outfile ' + image + ' ' + image, function() {
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
            cmd.get('nice gifsicle ' + image + ' -o ' + image, function() {
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
            cmd.get('nice pngcrush -rem alla -nofilecheck -reduce -m 7 -ow ' + image + ' &> /dev/null', function() {
              if (++asyncIndex == pngImages.length) {
                callback(false);
              }
            });
          }
          if (pngImages.length <= 0) {
            console.log("image optimization got executed");
            callback(false);
          }
        });
      };

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
        cmd.get('nice gzip --uncompress ' + file, function(data) {
          callback(false);
        });
      }
    };

    cmd.get('nice gzip -9r ' + stagingPath, function(data) {
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
