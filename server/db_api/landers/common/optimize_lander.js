module.exports = function(db) {

  var module = {};

  var htmlMinifier = require('html-minifier').minify;
  var yuiCompressor = require('yuicompressor');
  var imagemin = require('imagemin');
  var imageminMozjpeg = require('imagemin-mozjpeg');
  var imageminPngquant = require('imagemin-pngquant');
  var rimraf = require('rimraf');
  var purifycss = require('purifycss');
  var find = require('find');
  var fs = require('fs');
  var critical = require('critical');

  //ABOVE THE FOLD CSS OPTIMIZATION:
  //1. use critical to pull out the critical above the fold css and inline it minified

  //once the critical CSS is written into the html files we can now optimize the other css


  //2. use purify css to create 1 file css per folder path for css

  //3. lazy load all of these


  //HTML OPTIMIZATION

  //IMAGE OPTIMIZATION

  //JS OPTIMIZATION

  //GZIP OPTIMIZATION


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

  //inlines the async purified css or includes it async depending on file size 
  module.inlinePurifiedCss = function(callback) {


    callback(false);

  }


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


  //run after css is optimized to remove uneccesssary css write to purified.css

  //the css that is necessary for all the landers to operate correctly. this will be async loaded
  module.purifyCss = function(staging_path, callback) {
    var outputPath = staging_path + '/purified.css';

    find.file(/\.css$/, staging_path, function(cssFiles) {
      find.file(/\.html$/, staging_path, function(htmlFiles) {

        purifycss(htmlFiles, cssFiles, function(purifiedAndMinifiedResult) {

          fs.writeFile(outputPath, purifiedAndMinifiedResult, function(err) {
            if (err) {
              callback(err);
            } else {
              callback(false);
            }
          });
        });
      });
    });

  };


  module.optimizeCss = function(staging_path, callback) {

    var inlineCriticalCss = function(callback) {
      //loop each html endpoint and generate the critical css
      find.file(/\.css$/, staging_path, function(cssFiles) {

        for (var i = 0; i < cssFiles.length; i++) {
          cssFiles[i] = cssFiles[i].replace(staging_path, "");
        }

        var base = process.cwd() + "/" + staging_path;

        console.log("css: " + JSON.stringify(cssFiles));
        find.file(/\.html$/, staging_path, function(htmlFiles) {

          for (var i = 0; i < htmlFiles.length; i++) {

            var filename = htmlFiles[i].replace(staging_path, "");
            console.log("filename: " + filename);
            console.log("process.cwd(): " + base);

            // use critical to pull out the critical above the fold css and inline it minified
            critical.generate({
              // Inline the generated critical-path CSS
              // - true generates HTML
              // - false generates CSS
              inline: true,

              // Your base directory
              base: 'staging/' + '21c0410a621d4717f20cb72e5cdfe87d/landertoupload',

              // HTML source
              // html: '<html>...</html>',

              // HTML source file
              src: 'index.html',

              // Your CSS Files (optional)
              css: 'css/css.css',

              // Viewport width
              width: 1300,

              // Viewport height
              height: 900,

              // Target for final HTML output.
              // use some css file when the inline option is not set
              dest: 'index-critical.html',

              // Minify critical-path CSS when inlining
              minify: true,

              // Extract inlined styles from referenced stylesheets
              extract: true,

              // Complete Timeout for Operation
              timeout: 30000,

              // Prefix for asset directory
              // pathPrefix: '/',

              // ignore css rules
              // ignore: ['font-face', /some-regexp/],

              // overwrite default options
              ignoreOptions: {}
            }, function(err, output) {

              // You now have critical-path CSS
              // Works with and without dest specified
              console.log("err: " + err)
              console.log("output: " + output)
            });

          }

        });
      });

    };

    var purifyCss = function(callback) {
      // use purify css to create 1 file css per folder path for css

    }

    var inlineAsyncCss = function(callback) {
      // async load all purify css files from each folder

    }


    inlineCriticalCss(function(err) {

      console.log("HIHIHI")


    });


    //TODO get rid of unused CSS
    // module.purifyCss(staging_path, function(err) {
    //   if (err) {
    //     callback({ code: "CouldNotPurifyCss" });
    //   } else {
    //     console.log("inlining purified css");
    //     module.inlinePurifiedCss(function(err) {
    //       if (err) {
    //         callback({ code: "CouldNotInlinePurifiedCss" });
    //       } else {

    //       }
    //     });
    //   }
    // });




    //- get all the js files in the staging path
    // find.file(/\.css$/, staging_path, function(cssFiles) {

    //   //- loop through them all keep an async index count
    //   var asyncIndex = 0;
    //   for (var i = 0; i < cssFiles.length; i++) {
    //     //- on loop compress
    //     yuiCompressor.compress(cssFiles[i], {
    //       charset: 'utf8',
    //       type: 'js',
    //       nomunge: true,
    //       'line-break': 80
    //     }, function(err, compressedFile, extra) {
    //       if (err) {
    //         console.log("could not compress file: " + cssFiles[i]);
    //       } else {

    //         console.log("compressed " + cssFiles[asyncIndex]);

    //         //- and overwrite the file
    //         fs.writeFile(cssFiles[asyncIndex], compressedFile, function(err) {
    //           if (++asyncIndex == cssFiles.length) {
    //             //- callback when done                
    //             callback(false);
    //           }
    //         });
    //       }
    //     });
    //   }
    // });

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
