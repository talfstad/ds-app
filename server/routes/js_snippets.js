module.exports = function(app, db, passport) {
  var module = {};

  var db = require("../db_api");


  app.get('/api/js_snippets', function(req, res) {
    var user = req.user;

    db.js_snippets.getAll(user, function(rows) {
      res.json(rows);
    });
  });

  app.put('/api/js_snippets/:snippet_id', function(req, res) {
    var user = req.user;
    var params = req.body;
    var action = params.action;

    //if set adds snippet to the urlEndpoint
    if (action === "addSnippetToUrlEndpoint") {
      db.js_snippets.addSnippetToUrlEndpoint(user, params, function(returnObj) {
        res.json(returnObj);
      });
    } else if (action === "saveEditInfo") {
      db.js_snippets.saveEditInfo(user, params, function(returnObj) {
        res.json(returnObj);
      });
    } else if (action === "saveCode") {
      db.js_snippets.saveCode(user, params, function(returnObj) {
        res.json(returnObj);
      });
    }


  });




  return module;

}
