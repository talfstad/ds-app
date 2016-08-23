module.exports = function(app, db) {

  var module = {};

  module.validate = require('../validate')(app, db);

  module.deployLanderToDomain = require('./deploy_lander_to_domain')(app, db);

  module.undeployLanderFromDomain = require('./undeploy_lander_from_domain')(app, db);

  module.deleteLander = require('./delete_lander')(app, db);

return module;

}