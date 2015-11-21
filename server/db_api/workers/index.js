module.exports = function(db) {

	undeployLanderFromDomain = require('./undeploy_lander_from_domain')(db);
	addNewLander = require('./add_new_lander')(db);

};