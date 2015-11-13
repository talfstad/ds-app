module.exports = function(app, db, passport) {
    var module = {};

    var db = require("../db_api");
    

    app.get('/api/campaigns', function(req,res){
      var user = req.user;
      db.campaigns.getAll(user, function(rows) {
        res.json(rows);
      });
    });

    app.post('/api/campaigns', function(req, res) {
     
    });

    app.put('/api/campaigns', function(req, res) {
     
    });

    app.delete('/api/campaigns', function(req, res) {
     
    });

    return module;

}