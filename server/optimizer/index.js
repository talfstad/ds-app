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
  var UglifyJS = require('uglify-js');

  //optimizer has an optimize function that takes an HTML file path, optimized file output path,
  module.fullyOptimize = function(stagingPath, callback) {
    console.log("fully optimized called: " + stagingPath);

    //pass all html files over to optimize css
    var optimizationErrors = [];

    find.file(/\.html$/, stagingPath, function(htmlFilePaths) {
      //create htmlFiles obj for saving
      var htmlFiles = [];
      for (var i = 0; i < htmlFilePaths.length; i++) {
        var fileObj = {
          filename: htmlFilePaths[i],
          optimizationErrors: []
        }
        htmlFiles.push(fileObj);
      }

      module.optimizeCss(htmlFiles, function(err) {
        //push optimization errors
        optimizationErrors.concat(err);

        app.log("done with css", "debug");
        module.optimizeJs(stagingPath, htmlFiles, function(err) {
          //push optimization errors
          optimizationErrors.concat(err);

          app.log("done with js", "debug");
          module.optimizeHtml(htmlFiles, function(err) {
            //push optimization errors
            optimizationErrors.concat(err);

            app.log("done with html", "debug");
            module.optimizeImages(stagingPath, function(err) {
              //push optimization errors
              optimizationErrors.concat(err);

              app.log("done with images", "debug");

              module.gzipStagingFiles(stagingPath, function(err) {
                //push optimization errors
                optimizationErrors.concat(err);

                app.log("done gzipping", "debug");
                callback(false, htmlFiles, optimizationErrors);
              });
            });
          });
        });
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

    var purifyAndCriticalCssFile = function(htmlFileObj, html, styles, callback) {
      //workers only do work if there are no errors on this endpoint
      if (htmlFileObj.optimizationErrors.length > 0) {
        callback(false);
      } else {
        var fullHtmlFilePath = htmlFileObj.filename;

        var fullHtmlFileDirPath = path.dirname(fullHtmlFilePath);
        var fileName = path.basename(fullHtmlFilePath);

        var purifyOptions = {
          minify: true
        };

        purifyCss(html, styles, purifyOptions, function(purifiedAndMinifiedResult) {
          var outputCssFile = path.join(fullHtmlFileDirPath, fileName + ".css");

          //write html file one css file has been successfull or dont write it
          fs.writeFile(outputCssFile, purifiedAndMinifiedResult, function(err) {
            if (err) {
              callback({ code: "CouldNotWritePurifiedMinifiedCssFile", err: err });
            } else {
              fs.writeFile(fullHtmlFilePath, html, function(err) {
                if (err) {
                  callback({ code: "CouldNotWriteOptimizedEndpointFile", err: err });
                } else {
                  //runs in its own thread so it will clean up its stupid ass tmp files
                  cmd.get("node ./optimizer/critical_css_thread " + fullHtmlFilePath + " " + outputCssFile + " " + fileName, function(output) {
                    // search output for custom error and get the JSON
                    var err = JSON.parse(/%startErr%(.*?)%endErr%/.exec(output));
                    if (err) {
                      callback({ code: "CouldNotCriticalCss", err: err });
                    } else {
                      callback(false);
                    }
                  });
                }
              });
            }
          });
        });
      }
    }

    var optimizeCssFileForEndpoint = function(htmlFileObj, fileData, callback) {
      //workers only do work if there are no errors on this endpoint
      if (htmlFileObj.optimizationErrors.length > 0) {
        callback(false);
      } else {
        var fullHtmlFilePath = htmlFileObj.filename;

        //set to the async
        var fullHtmlFileDirPath = path.dirname(fullHtmlFilePath);
        var fileName = path.basename(fullHtmlFilePath);

        var $ = cheerio.load(fileData, { decodeEntities: false });

        // get all the href's to minimize from the html file
        $('link[rel="stylesheet"]').each(function(i, link) {
          var href = $(this).attr("href");
          cssFiles.push(href);
        });

        $('<link rel="stylesheet" type="text/css" href="' + fileName + '.css">').appendTo('head');

        //with list of relative or absolute css files use clean css to combine them
        //and rewrite the urls
        var cleanCssFiles = cssFiles
          .map(function(cssFilename) {
            //check extension
            var isCss = true;
            if (cssFilename.indexOf('#') > -1) {
              var sanitizedCssFilename = cssFilename.substring(0, cssFilename.indexOf('#'));
              if (!/.css$/.test(sanitizedCssFilename)) {
                isCss = false;
              }
            }

            if (isCss) {
              return '@import url(' + cssFilename + ');';

              //remove the original css file for this
              var linkToRemove = $('link[rel="stylesheet"][href="' + cssFilename + '"');
              if (linkToRemove.length) {
                console.log("GOOD removing: " + cssFilename + " stylesheet from HTML");
                linkToRemove.remove();
              }
              .remove();
            }

          })
          .join('');

        try {
          new CleanCSS({
            root: fullHtmlFileDirPath
          }).minify(cleanCssFiles, function(err, minified) {
            if (err) {
              callback({ code: "CouldNotCleanCssAndMinify", err: err });
            } else {

              app.log("cleaned css files: " + JSON.stringify(cleanCssFiles), "debug");

              var styles = minified.styles;
              callback(false, $.html(), styles);
            }
          });
        } catch (err) {
          callback({ code: "CouldNotCleanCssAndMinify", err: err });
        }

      }
    };

    var readFile = function(htmlFileObj, callback) {
      //workers only do work if there are no errors on this endpoint
      if (htmlFileObj.optimizationErrors.length > 0) {
        callback(false);
      } else {
        var filename = htmlFileObj.filename;

        //this is always a local html file
        fs.readFile(filename, function(err, fileData) {
          if (err) {
            callback({ code: "CouldNotReadEndpoint", err: err });
          } else {
            callback(false, htmlFileObj, fileData);
          }
        });
      }
    };

    var asyncIndex = 0;
    for (var i = 0; i < htmlFiles.length; i++) {

      //read file in as a string
      var cssFiles = [];
      readFile(htmlFiles[i], function(err, htmlFileObj, fileData) {
        if (err) {
          htmlFiles[asyncIndex].optimizationErrors.push({
            type: "css",
            code: err.code
          });
        }
        optimizeCssFileForEndpoint(htmlFileObj, fileData, function(err, html, styles) {
          if (err) {
            htmlFiles[asyncIndex].optimizationErrors.push({
              type: "css",
              code: err.code
            });
          }
          purifyAndCriticalCssFile(htmlFileObj, html, styles, function(err) {
            if (err) {
              htmlFiles[asyncIndex].optimizationErrors.push({
                type: "css",
                code: err.code
              });
            }

            if (++asyncIndex == htmlFiles.length) {
              callback(false);
            }
          });
        });
      });
    }
    if (htmlFiles.length <= 0) {
      callback(false);
    }
  }


  module.optimizeJs = function(stagingPath, htmlFiles, callback) {

    var readExternalFile = function(href, callback) {
      //worker can do work no matter what because its just reading
      //file and isnt used by main loop. only used by another worker function
      request(href, function(err, response, body) {
        if (err && response.statusCode != 200) {
          callback(err);
        } else {
          callback(false, body);
        }
      });
    };

    var readLocalFile = function(inFilePathOrObj, callback) {
      var filePath = inFilePathOrObj;
      var isObj = false;
      if (typeof inFilePathOrObj == 'object') {
        isObj = true;
        filePath = filePath.filename;
      }

      //workers only do work if there are no errors on this endpoint
      if (isObj) {
        if (inFilePathOrObj.optimizationErrors.length > 0) {
          callback(false);
        }
      } else {

        fs.exists(filePath, function(exists) {
          if (exists) {
            fs.readFile(filePath, function(err, fileData) {
              if (err) {
                callback({ code: "CouldNotReadLocalFile", err: err });
              } else {
                callback(false, fileData, inFilePathOrObj);
              }
            });
          } else {
            callback({ code: "LocalFileDoesNotExist", err: err });
          }
        });

      }
    };

    var readSrcFile = function(filePath, callback) {
      //worker can do work no matter what because its just reading
      //file and isnt used by main loop. only used by another worker function
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

    var compressAndWriteFile = function(htmlFileObj, jsFilePath, callback) {
      //workers only do work if there are no errors on this endpoint
      if (htmlFileObj.optimizationErrors.length > 0) {
        callback(false);
      } else {
        // call uglify on the file
        try {
          var result = UglifyJS.minify(jsFilePath, {});

        } catch (err) {
          callback({ code: "CouldNotUglify", err: err });
          return;
        }

        //overwrite the file if success
        fs.writeFile(jsFilePath, result.code, function(err) {
          if (err) {
            callback({ code: "CouldNotWriteUglifiedJsFile", err: err });
          } else {
            callback(false);
          }
        });
      }
    };

    var concatJsIntoFileAndUpdateHtml = function(htmlFileObj, fileData, callback) {
      //workers only do work if there are no errors on this endpoint
      if (htmlFileObj.optimizationErrors.length > 0) {
        callback(false);
      } else {
        var htmlFilePath = htmlFileObj.filename;

        //load it in cheerio, get all script tags that dont have the class "ds-no-modify"
        var $ = cheerio.load(fileData, { decodeEntities: false });
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
            if (err) {
              callback({ code: "CouldNotReadSrcFile", err: err });
            } else {
              srcFilesObj[scriptSrcArr.indexOf(filePath)] = fileData;

              if (++asyncIndex == scriptSrcArr.length) {

                for (var j = 0; j < scriptSrcArr.length; j++) {

                  //make sure src file ends with a new line (signifying done statement)
                  srcFilesObj[j] += "\n";

                  finalJsString += srcFilesObj[j];
                }

                fs.writeFile(outputJsFilePath, finalJsString, function(err) {
                  if (err) {
                    callback({ code: "CouldNotWriteUnCompressedJsFile", err: err });
                  } else {
                    //append the optimized script tag to the body
                    fs.writeFile(htmlFilePath, $.html(), function(err) {
                      if (err) {
                        callback({ code: "CouldNotWriteHtmlFile", err: err });
                      } else {
                        callback(false, htmlFileObj, outputJsFilePath);
                      }
                    });
                  }
                });
              }
            }
          });
        }
        if (scriptSrcArr.length <= 0) {
          callback(false, outputJsFilePath);
        }
      }
    };



    var asyncIndex = 0;
    for (var i = 0; i < htmlFiles.length; i++) {

      //read file in as a string
      readLocalFile(htmlFiles[i], function(err, fileData, htmlFileObj) {
        if (err) {
          htmlFiles[asyncIndex].optimizationErrors.push({
            type: "js",
            code: err.code
          });
        }
        concatJsIntoFileAndUpdateHtml(htmlFileObj, fileData, function(err, htmlFileObj, jsFilePath) {
          if (err) {
            htmlFiles[asyncIndex].optimizationErrors.push({
              type: "js",
              code: err.code
            });
          }
          compressAndWriteFile(htmlFileObj, jsFilePath, function(err) {
            if (err) {
              htmlFiles[asyncIndex].optimizationErrors.push({
                type: "js",
                code: err.code
              });
            }
            if (++asyncIndex == htmlFiles.length) {
              callback(false);
            }
          });
        });
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
