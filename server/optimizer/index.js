//read all css files from endpoint into a string

//concat them all into 1 string for yuicompressor

//compress them all

//write it to a file

//purify that file

//critical css that purified file

//inline the critical stuff and async load the rest of the css



//optimizer has an optimize function that takes an HTML file path, optimized file output path,
//


exports.optimizeHtmlFile = function(options, callback) {
  var htmlFilePath = options.htmlFilePath;
  var webBasePath = options.webBasePath;
  var content = options.content || htmlFilePath;
  var outputFilePath = process.cwd() + "/" + options.outputFilePath;
  var CleanCSS = require('clean-css');
  var path = require('path');
  var purifyCss = require('purify-css');
  var cheerio = require('cheerio');
  var fs = require('fs');
  var critcialCss = require('critical');

  console.log("output file path: " + outputFilePath)

  if (!htmlFilePath || !webBasePath) {
    console.log("Cannot optimize unless you have a html file path and a web base path!!");
    return;
  }


  //if beginning or trailing slash remove it
  webBasePath = webBasePath.replace(/$\//, "");
  webBasePath = webBasePath.replace(/^\//, "");

  //get a list of all the css files in the html file path
  console.log("webbase: " + webBasePath)

  //read file in as a string
  var cssFiles = [];
  fs.readFile(htmlFilePath, function(err, fileData) {
    if (err) {
      console.log("error: " + err);
    } else {

      var $ = cheerio.load(fileData);

      // get all the href's to minimize from the html file
      $('link[rel="stylesheet"]').each(function(i, link) {
        var href = $(this).attr("href");
        href = href.replace(/^\//, "");
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
        root: path.join(process.cwd(), webBasePath)
      }).minify(data, function(error, minified) {
        if (error)
          throw error;

        var styles = minified.styles;
        fs.writeFile(outputFilePath + ".notpurified", styles, function(err) {
          if (err) {
            console.log("err: " + err);
          } else {

            var purifyOptions = {
              minify: true
            };

            purifyCss(content, styles, purifyOptions, function(purifiedAndMinifiedResult) {

              fs.writeFile(outputFilePath, purifiedAndMinifiedResult, function(err) {
                if (err) {
                  console.log("err: " + err);
                } else {

                  //fix up the html endpoint file and rewrite it!
                  $('<link rel="stylesheet" type="text/css" href="style.css">').appendTo('head');
                  fs.writeFile(htmlFilePath, $.html(), function(err) {
                    if (err) {
                      console.log("err: " + err);
                    } else {
                    	console.log("process cwd: " + process.cwd())
                      //now extract out the above the fold css!
                      critcialCss.generate({
                      	extract: true,
                      	base: "/Users/alfstad/buildcave/landerds/built/",
                        src: '/Users/alfstad/buildcave/landerds/built/server/index.html',
                        css: ['/Users/alfstad/buildcave/landerds/built/public/style.css'],
                        dest: "/Users/alfstad/buildcave/landerds/built/server/index.html",
                        minify: true,
                        inline: true,
                        ignore: ['@font-face', /url\(/]
                      });

                      callback(false);

                    }
                  });





                }
              });
            });

          }
        });

      });







      // concatCssFiles(cssFiles, function(cssFile) {

      //   yuicompressor.compress(cssFile, {
      //     //Compressor Options: 
      //     charset: 'utf8',
      //     type: 'css',
      //     outfile: 'built/public/assets/skin/style.min.css',
      //     'line-break': 80
      //   }, function(err, data, extra) {
      //     if (err) {
      //       console.log("error: " + err);
      //     } else {
      //       fs.writeFile(outputFilePath, data, function(err) {
      //         if (err) {
      //           console.log("err: " + err);
      //         } else {
      //           console.log("chek to see if file is there!");
      //         }
      //       });
      //     }


      //     //err   If compressor encounters an error, it's stderr will be here 
      //     //data  The compressed string, you write it out where you want it 
      //     //extra The stderr (warnings are printed here in case you want to echo them 




      //     // var purifyOptions = {
      //     //   output: 'built/public/assets/skin/style.css',
      //     //   minify: true,
      //     //   silent: true
      //     // };
      //     // purifycss(content, cssFiles, purifyOptions);


      //   });
      // });


    }
  });



  return true;

}
