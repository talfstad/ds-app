module.exports = function(app) {

  //module is a function that logs to console depending on config

  var module = function(logMessage, logLevel) {
    //build log message 
    if (app.config.logLevel == logLevel || app.config.logLevel == "all") {
      console.log(logMessage);
    }
  };

  return module;

}