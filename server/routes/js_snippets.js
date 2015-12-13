module.exports = function(app, db, passport) {
    var module = {};
    
    var db = require("../db_api");


    app.get('/api/js_snippets', function(req,res){
      var user = req.user;
     
      db.js_snippets.getAll(user, function(rows) {
        res.json(rows);
      });
    });


   

    return module;

}