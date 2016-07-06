module.exports = function(db) {

  var module = {};

  var htmlMinifier = require('html-minifier').minify;
  var yuiCompressor = require('yuicompressor');
  var imagemin = require('imagemin');
  var imageminMozjpeg = require('imagemin-mozjpeg');
  var imageminPngquant = require('imagemin-pngquant');
  var rimraf = require('rimraf');

  var find = require('find');
  var fs = require('fs');

  module.fullyOptimize = function(staging_path, callback) {

    module.optimizeJs(staging_path, function(err) {
      console.log("optimizing js");
      if (err) {
        callback({ code: "CouldNotOptimizeJs" });
      } else {
        module.optimizeCss(staging_path, function(err) {
          console.log("optimizing css");
          if (err) {
            callback({ code: "CouldNotOptimizeCss" });
          } else {
            console.log("optimizing html");
            module.optimizeHtml(staging_path, function(err) {
              if (err) {
                callback({ code: "CouldNotOptimizeHtml" });
              } else {
                console.log("optimizing images");
                module.optimizeImages(staging_path, function(err) {
                  if (err) {
                    callback({ code: "CouldNotOptimizeImages" });
                  } else {
                    callback(false);
                  }
                });
              }
            });
          }
        });
      }
    });

  };

  module.optimizeJs = function(staging_path, callback) {

    //- get all the js files in the staging path
    find.file(/\.js$/, staging_path, function(files) {

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
              console.log("asyncIndex: " + asyncIndex);

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

  module.optimizeCss = function(staging_path, callback) {
    //- get all the js files in the staging path
    find.file(/\.css$/, staging_path, function(files) {

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

  module.optimizeHtml = function(staging_path, callback) {
    find.file(/\.html$/, staging_path, function(files) {

      var asyncIndex = 0;
      for (var i = 0; i < files.length; i++) {

        fs.readFile(files[i], 'utf8', function(err, file) {
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
            fs.writeFile(files[asyncIndex], minifiedFile, function(err) {
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

  //NEEDS LIBPNG
  module.optimizeImages = function(staging_path, callback) {
    var optimized_path = staging_path + "/optimized";
    //lossless image compression
    find.file(/\.jpg$|\.png$/, staging_path, function(images) {

      // console.log("images: " + JSON.stringify(images));
      // console.log("staging_path: " + staging_path + "/images");

      imagemin(images, optimized_path, {
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
              rimraf(optimized_path, function() {
                callback(false);
              });
            }
          });
        }

      }, function(err) {
        callback(err);
      });
    });
  };

  return module;
}
