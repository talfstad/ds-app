module.exports = function(app, passport) {
    var module = {};
    
    var db = require("../db_api");


    app.get('/api/domains', passport.isAuthenticated(), function(req,res){
      var user = req.user;
      db.domains.getAll(user, function(rows) {
        res.json(rows);
      });
    });


    app.post('/api/domains', passport.isAuthenticated(), function(req, res) {
      //call insertDomain on db_api
    });

    app.put('/api/domains/:domain_id', passport.isAuthenticated(), function(req, res) {
      var user = req.user;
      
      var modelAtributes = req.body;

      db.domains.saveDomain(user, modelAtributes, function(){
        res.json(modelAtributes);
      });

    });

    app.delete('/api/domains', passport.isAuthenticated(), function(req, res) {
     
    });

    return module;

}