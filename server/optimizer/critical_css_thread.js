  var criticalCss = require('critical');

  var fullHtmlFileDirPath = process.argv[2];
  var outputCssFile = process.argv[3];
  var htmlFile = process.argv[4]

  console.log("thread base: " + fullHtmlFileDirPath);
  console.log("thread html file: " + htmlFile);
  console.log("thread css: " + outputCssFile);



 criticalCss.generate({
    base: fullHtmlFileDirPath,
    src: htmlFile,
    css: [outputCssFile],
    dest: htmlFile,
    minify: true,
    inline: true,
    ignore: ['@font-face', /url\(/]
  }, function(err, output){
    if(err){
      console.log(err);
    } else {
      console.log(err);
      console.log(output);
    }
  });


 