module.exports = function(app, db) {

  var module = {};

  var htmlMinifier = require('html-minifier').minify;
  var yuiCompressor = require('yuicompressor');
  var imagemin = require('imagemin');

  var find = require('find');
  var fs = require('fs');

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

  module.optimizeImages = function(staging_path, callback) {
    //lossless image compression
    find.file(/\.png$/, staging_path, function(images) {

      new imagemin()
        .src(images)
        .use(imagemin.optipng({ optimizationLevel: 3 }))
        .run(function(err, compressedImages) {
          var asyncIndex = 0;
          for (var i = 0; i < compressedImages.length; i++) {
            // => {path: 'build/images/foo.jpg', contents: <Buffer 89 50 4e ...>} 
            var path = compressedImages[i].path;
            var contents = compressedImages[i].contents;

            console.log("optimized image path: " + path);

            fs.writeFile(path, contents, function(err) {
              if (++asyncIndex == compressedImages.length) {
                //- callback when done                
                callback(false);
              }
            });
          }
        });
    });
  };

  return module;
}
