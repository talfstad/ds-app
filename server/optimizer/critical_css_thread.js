  var criticalCss = require('critical');
  var path = require('path');

  var fullHtmlFilePath = process.argv[2];
  var outputCssFile = process.argv[3];
  var htmlFile = process.argv[4]
  var fullHtmlFileDirPath = path.dirname(fullHtmlFilePath);

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
      console.log(" %startErr% " + JSON.stringify(err) + " %endErr% ");
    } else {
      console.log(" %startErr% " + JSON.stringify({}) + " %endErr% ");
    }

  });
