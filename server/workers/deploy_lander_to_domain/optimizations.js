module.exports = function(app, db) {

  var module = {};

  var htmlMinifier = require('html-minifier').minify;
  var yuiCompressor = require('yuicompressor');

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
    callback();
  };

  module.optimizeHtml = function(staging_path, callback) {

    // var result = htmlMinifier('<p title="blah" id="moo">foo</p>', {
    //   removeAttributeQuotes: true
    // });


    callback(false);
  };

  return module;
}
