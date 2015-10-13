module.exports = function(app, db, passport) {
  var module = {};

  var config = require("../config");
  var Puid = require('puid');
  var utils = require('../utils/utils.js')();
  var db = require("../db_api");

  app.post('/api/updater', function(req, res) {

    res.json([
      {
        id: 1,
        deploy_status: "deployed",
        processing: false
      }
      ]);

  });

  return module;

}
