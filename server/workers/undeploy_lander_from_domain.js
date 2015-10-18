/*
    Undeploy worker module is responsible for:

    1. registering job and returning to client

    2. actually 

*/

module.exports = function(app, db) {

    var module = {};

    var config = require("../config");

    module.undeployLanderFromDomain = function(modelAttributes) {
      console.log("now starting undeploy");

    };

    return module.undeployLanderFromDomain;

}