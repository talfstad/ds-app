module.exports = function(app, db, passport) {
  var module = {};

  var config = require("../config");
  var Puid = require('puid');
  var utils = require('../utils/utils.js')();
  var db = require("../db_api");


  //checks the status of all models sent to it and updates them
  app.post('/api/updater', function(req, res) {
    var modelsAttributes = req.body;

    //. loop through all models

    //check db for procesing value
    //if true do nothing and return
    //if processing=false we're done! set model to the new model and return

    //. next

    for(var i=0 ; i<modelsAttributes.length ; i++){
      var modelAtributes = modelsAttributes[i];
      
      if(modelAtributes.action) {

      }
    }

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
