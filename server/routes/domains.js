module.exports = function(app, db, passport) {
    var module = {};
    
    var db = require("../db_api");

    app.post('/api/domains', function(req, res) {
      //call insertDomain on db_api
    });

    app.put('/api/domains/:domain_id', function(req, res) {
      var user = req.user;
      
      var modelAtributes = req.body;

      db.domains.saveDomain(user, modelAtributes, function(){
        res.json(modelAtributes);
      });

    });

    app.delete('/api/domains', function(req, res) {
     
    });

    return module;

}