module.exports = function(app, db, passport) {
  var module = {};

  var db = require("../db_api");

  var config = require("../config");
  var Puid = require('puid');
  var utils = require('../utils/utils.js')();



  //update aws access keys for user
  app.post('/api/updateAccessKeys', function(req, res) {
    var user = req.user;
    var user_id = user.id;

    var accessKeyId = req.body.accessKeyId;
    var secretAccessKey = req.body.secretAccessKey;

    db.aws.updateAccessKeys(user, accessKeyId, secretAccessKey, function(result) {
      console.log("updating access keys" + secretAccessKey + " " + accessKeyId);
      res.json(result);
    });
  });

  app.get('/api/updateAccessKeys', function(req, res){

    var user = req.user;

    db.aws.getAmazonApiKeys(user, function(response){
      res.json(response);
    });

  });

};
