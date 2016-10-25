module.exports = function(app, dbApi, awsApi) {

  var module = {
    add: require("./add")(app, dbApi, awsApi),
    optimize: require('./optimize')(app, dbApi, awsApi),
    download: require('./download')(app, dbApi, awsApi)
  };

  return module;
}
