module.exports = function(app, dbApi) {

  // to abstract to another api, make a different one and create a common interface for both
  var awsApi = require('../aws')(app, dbApi);

  var module = {
    aws: awsApi,
    landers: require('./landers')(app, dbApi, awsApi),
    log: require("./log")(app, dbApi, awsApi),
    jobs: require('./jobs')(app, dbApi, awsApi),
    intercom: require('./intercom')(app, dbApi, awsApi)
  };

  return module;
}