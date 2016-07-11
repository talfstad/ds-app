module.exports = function() {

  var module = {};


  var CleanCSS = require('clean-css');
  var path = require('path');
  var purifyCss = require('purify-css');
  var cheerio = require('cheerio');
  var fs = require('fs');
  var critcialCss = require('critical');
  var htmlMinifier = require('html-minifier').minify;
  var yuiCompressor = require('yuicompressor');
  var imagemin = require('imagemin');
  var imageminMozjpeg = require('imagemin-mozjpeg');
  var imageminPngquant = require('imagemin-pngquant');
  var rimraf = require('rimraf');
  var find = require('find');
  var fs = require('fs');


  //optimizer has an optimize function that takes an HTML file path, optimized file output path,
  module.fullyOptimize = function(stagingPath, callback) {

    //pass all html files over to optimize css
    find.file(/\.html$/, stagingPath, function(htmlFiles) {
      module.optimizeCss(htmlFiles, function(err) {
        console.log("done with css");

        // module.optimizeJs(htmlFiles, function(err) {
          console.log("done with js");
          module.optimizeHtml(htmlFiles, function(err) {
            console.log("done with html");
            module.optimizeImages(stagingPath, function(err) {
              console.log("done with images");

              callback(false);

            });
          });
        // });
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

    for (var i = 0; i < htmlFiles.length; i++) {
      var fullHtmlFilePath = htmlFiles[i];
      var fullHtmlFileDirPath = path.dirname(fullHtmlFilePath);
      var fileName = path.basename(fullHtmlFilePath);

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
              return '@import url(' + filename + ');';
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
                  console.log("err: " + err);
                } else {
                  console.log("htmlfile: " + fullHtmlFilePath);
                  console.log("cssfile: " + outputCssFile);

                  //fix up the html endpoint file with our new CSS
                  $('<link rel="stylesheet" type="text/css" href="' + fileName + '.css">').appendTo('head');

                  //now extract out the above the fold css!
                  critcialCss.generate({
                    extract: true,
                    base: './',
                    html: $.html(),
                    // src: fullHtmlFilePath,
                    css: [outputCssFile],
                    dest: fullHtmlFilePath,
                    minify: true,
                    inline: true,
                    ignore: ['@font-face', /url\(/]
                  });

                  callback(false);
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
  module.optimizeJs = function(options, callback) {

    var stagingPath = options.stagingPath;

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
            console.log("could not compress file: " + files[i]);
          } else {

            console.log("compressed " + files[asyncIndex]);

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
    var stagingPath = options.stagingPath || process.cwd();
    
    var asyncIndex = 0;
    for(var i=0 ; i<htmlFiles.length ; i++){
      var htmlFile = htmlFiles[i];

        fs.readFile(htmlFile, 'utf8', function(err, file) {
          if (err) {
            console.log(err);
            callback(err);
          } else {

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
          }
        });
      
    }
  };

  //NEEDS LIBPNG
  module.optimizeImages = function(stagingPath, callback) {
    // var stagingPath = options.stagingPath || process.cwd();

    //lossless image compression
    find.file(/\.jpg$|\.png$/, stagingPath, function(images) {

      imagemin(images, stagingPath, {
        plugins: [
          imageminMozjpeg({ targa: false }),
          imageminPngquant({ quality: '65-80' })
        ]
      }).then(function(compressedImages) {
        //overwrite the original images with the optimized images
        var asyncIndex = 0;
        for (var i = 0; i < images.length; i++) {

          var destImagePath = images[i];
          var originalImageName = destImagePath.split('/').pop();

          console.log("dest image path: " + destImagePath);

          var compressedImage = null;
          for (var j = 0; j < compressedImages.length; j++) {

            var compressedImageName = compressedImages[j].path.split('/').pop();
            //find the compressed image that matches the image we're on
            if (originalImageName == compressedImageName) {
              compressedImage = compressedImages[j];
              break;
            }
          }

          //copy it to the destImagePath
          fs.writeFile(destImagePath, compressedImage.data, function(err) {
            if (++asyncIndex == images.length) {
              callback(false);
            }
          });
        }

      }, function(err) {
        callback(err);
      });
    });
  };

  return module;

};
