module.exports = function(app, db) {
  var module = {};

  module.undeployLanderFromDomain = require('./undeploy_lander_from_domain')(app, db);
  module.deployLanderToDomain = require('./deploy_lander_to_domain')(app,db);

  module.startJob = function(action, user, attr) {
    //start job
    console.log("\nACTION: " + action);
    module[action](user, attr);
  };

  return module;
}