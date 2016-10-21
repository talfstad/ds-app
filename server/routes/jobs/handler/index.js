module.exports = function(app, dbApi, controller) {

  var module = {};

  //initialize timeout check
  var WorkerController = require("../../../workers")(app, dbApi, controller);
  WorkerController.initializeJobTimeoutCheck();

  module.validate = require('./validate')(app, dbApi, WorkerController, controller);

  module.deployLanderToDomain = require('./deploy_lander_to_domain')(app, dbApi, WorkerController, controller);

  module.undeployLanderFromDomain = require('./undeploy_lander_from_domain')(app, dbApi, WorkerController, controller);

  module.deleteLander = require('./delete_lander')(app, dbApi, WorkerController, controller);

  module.deleteDomain = require('./delete_domain')(app, dbApi, WorkerController, controller);

  module.ripLander = require('./rip_lander')(app, dbApi, WorkerController, controller);

  module.addLander = require('./add_lander')(app, dbApi, WorkerController, controller);

  module.deleteGroup = require('./delete_group')(app, dbApi, WorkerController, controller);

  return module;

}
