module.exports = function(app) {

  var module = {};

  var CleanCSS = require('clean-css');
  var path = require('path');
  var purifyCss = require('purify-css');
  var cheerio = require('cheerio');
  var fs = require('fs');
  var htmlMinifier = require('html-minifier').minify;
  var find = require('find');
  var fs = require('fs');
  var cmd = require('node-cmd');
  var request = require('request');

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
          module.optimizeJs(stagingPath, htmlFiles, function(err) {
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

      var $ = cheerio.load(fileData, {decodeEntities: false});

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


  module.optimizeJs = function(stagingPath, htmlFiles, callback) {

    var readExternalFile = function(href, callback) {
      request(href, function(err, response, body) {
        if (err && response.statusCode != 200) {
          callback(err);
        } else {
          callback(false, body);
        }
      });
    };

    var readLocalFile = function(filePath, callback) {
      fs.exists(filePath, function(exists) {
        if (exists) {
          fs.readFile(filePath, function(err, fileData) {
            if (err) {
              callback(err);
            } else {
              callback(false, fileData, filePath);
            }
          });
        } else {
          callback(false);
        }
      });
    };

    var readSrcFile = function(filePath, callback) {
      var isExternal = function(href) {
        return /(^\/\/)|(:\/\/)/.test(href);
      };

      if (isExternal(filePath)) {
        readExternalFile(filePath, function(err, fileData) {
          if (err) {
            callback(err);
          } else {
            callback(false, fileData, filePath);
          }
        });
      } else {
        var filePath = path.join(stagingPath, filePath);
        readLocalFile(filePath, function(err, fileData) {
          if (err) {
            callback(err);
          } else {
            var relativePath = filePath.replace(stagingPath, "");
            relativePath = relativePath.replace(/^\//, "");
            callback(false, fileData, relativePath);
          }
        });
      }
    };

    var compressAndWriteFile = function(jsFilePath, callback) {
      //call yuicompressor on the file
      // yuiCompressor.compress(jsFilePath, {
      //   charset: 'utf8',
      //   type: 'js',
      //   nomunge: true,
      //   'line-break': 80
      // }, function(err, compressedFile, extra) {
      //   if (err) {
      //     callback(err);
      //   } else {
      //     //- and overwrite the file
      //     fs.writeFile(jsFilePath, compressedFile, function(err) {
      //       if (err) {
      //         callback(err);
      //       } else {
      //         callback(false);
      //       }
      //     });
      //   }
      // });

      callback(false);
    };

    var concatJsIntoFileAndUpdateHtml = function(htmlFilePath, fileData, callback) {
      //load it in cheerio, get all script tags that dont have the class "ds-no-modify"
      var $ = cheerio.load(fileData, {decodeEntities: false});
      var srcFilesObj = {};

      var outputJsFilePath = htmlFilePath + ".js";

      //get all javascript source itself from the file and concat it together into a var
      var scriptTags = $('script:not(.ds-no-modify)');

      var scriptSrcArr = [];
      $('script:not(.ds-no-modify)').each(function(i, link) {
        var src = $(this).attr("src");
        if (src) {
          var srcToAdd = src.replace(/^\//, ""); //remove leading slash if there is one
          scriptSrcArr.push(srcToAdd);
        } else {
          scriptSrcArr.push("placeholder"); //placeholder to iterate through later (because we're re-ordering async requests)
          srcFilesObj[i] = $(this).text();
        }
        $(this).remove();
      });

      var minifiedSrc = outputJsFilePath.replace(stagingPath, "");
      minifiedSrc = minifiedSrc.replace(/^\//, "");

      var newScriptTag = $("<script async type='text/javascript' src='" + minifiedSrc + "'></script>")
      newScriptTag.appendTo("body");

      var asyncIndex = 0;
      var finalJsString = "";
      for (var i = 0; i < scriptSrcArr.length; i++) {
        readSrcFile(scriptSrcArr[i], function(err, fileData, filePath) {

          srcFilesObj[scriptSrcArr.indexOf(filePath)] = fileData;

          if (++asyncIndex == scriptSrcArr.length) {

            for (var j = 0; j < scriptSrcArr.length; j++) {

              //make sure src file has a semi colon ending it
              if (!(/;$/).test(srcFilesObj[j])) {
                srcFilesObj[j] += ";";
              }

              finalJsString += srcFilesObj[j];
            }

            fs.writeFile(outputJsFilePath, finalJsString, function(err) {
              if (err) {
                callback(err);
              } else {
                //append the optimized script tag to the body
                fs.writeFile(htmlFilePath, $.html(), function(err) {
                  if (err) {
                    callback(err);
                  } else {
                    callback(false, outputJsFilePath);
                  }
                });
              }
            });
          }
        });
      }
      if (scriptSrcArr.length <= 0) {
        callback(false, outputJsFilePath);
      }
    };

    var asyncIndex = 0;
    for (var i = 0; i < htmlFiles.length; i++) {
      //read file in as a string
      readLocalFile(htmlFiles[i], function(err, fileData, filePath) {
        if (err) {
          callback(err);
        } else {
          concatJsIntoFileAndUpdateHtml(filePath, fileData, function(err, jsFilePath) {
            if (err) {
              callback(err);
            } else {
              if (jsFilePath) {
                compressAndWriteFile(jsFilePath, function(err) {
                  if (err) {
                    callback(err);
                  } else {
                    if (++asyncIndex == htmlFiles.length) {
                      callback(false);
                    }
                  }
                });
              }

            }
          });
        }
      });
    }
    if (htmlFiles.length <= 0) {
      callback(false);
    }
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
          // console.log("minifying html for: " + filePath);
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
          cmd.get('nice pngcrush -rem alla -reduce -m 1 -m 4 -m 7 -ow ' + image + ' &> /dev/null', function() {
            if (++asyncIndex == pngImages.length) {
              callback(false);
            }
          });
        }
        if (pngImages.length <= 0) {
          callback(false);
        }
      });
    };


    if (!app.config.optimize.images) {
      console.log("ALERT: not optimizing images");
      callback(false);
    } else {
      optimizePng(function(err) {
        if (err) {
          callback(err);
        } else {
          optimizeJpg(function(err) {
            if (err) {
              callback(err);
            } else {
              optimizeGif(function(err) {
                if (err) {
                  callback(err);
                } else {
                  callback(false);
                }
              });
            }

          });
        }
      });
    }
  };

  module.gzipStagingFiles = function(stagingPath, callback) {

    var renameFile = function(file, callback) {
      var newName = file.replace(/\.gz$/, '');
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
        console.log("uncompressing: " + file);
        cmd.get('nice gzip -d ' + file, function(data) {
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

