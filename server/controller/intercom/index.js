module.exports = function(app, dbApi, awsApi) {

  var base = require("../base")(app, dbApi);

  var module = _.extend({

   

  }, base.intercom);

  return module;
};