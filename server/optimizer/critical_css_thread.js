  var criticalCss = require('critical');
  var path = require('path');

  var fullHtmlFilePath = process.argv[2];
  var outputCssFile = process.argv[3];
  var htmlFile = process.argv[4]
  var fullHtmlFileDirPath = path.dirname(fullHtmlFilePath);

  console.log("thread base: " + fullHtmlFileDirPath);
  console.log("thread html file: " + htmlFile);
  console.log("thread css: " + outputCssFile);
  console.log("thread outputHtmlFile: " + fullHtmlFilePath);



  criticalCss.generate({
    base: fullHtmlFileDirPath,
    src: htmlFile,
    css: [outputCssFile],
    dest: fullHtmlFilePath,
    minify: true,
    inline: true,
    ignore: ['@font-face', /url\(/]
  }, function(err, output) {
    if (err) {
      console.log(err);
    } else {
      console.log(err);
      console.log(output);
    }
  });
