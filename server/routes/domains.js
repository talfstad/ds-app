module.exports = function(app, db, passport) {
    var module = {};
    
    var db = require("../db_api");
    var undeployWorker = require("../workers/undeploy.js")();

    app.post('/api/domains', function(req, res) {
      
    });

    app.put('/api/domains/:domain_id', function(req, res) {
      var modelAtributes = req.body;
      //1. save the modelAtributes to the db
      db.domains.saveDomain(modelAtributes, function(){
        //2. check action attribute
        if(modelAtributes.action === "undeploy") {
          //second param is success callback
          undeployWorker.undeploy(modelAtributes, function(modelAtributes){
            //return saved model to client
            res.json(modelAtributes);
          });
        
        }

      });

      
      
      

    });

    app.delete('/api/domains', function(req, res) {
     
    });

    return module;

}