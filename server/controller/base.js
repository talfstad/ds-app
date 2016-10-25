module.exports = function(app, dbApi) {

  var module = {
    intercom: require('./intercom/base')(app, dbApi)
  };

  return module;
}