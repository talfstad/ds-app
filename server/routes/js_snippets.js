module.exports = function(app, passport) {
  var module = {};

  var db = require("../db_api")(app);


  app.get('/api/js_snippets', passport.isAuthenticated(), function(req, res) {
    var user = req.user;

    db.js_snippets.getAll(user, function(rows) {
      res.json(rows);
    });
  });

  app.post('/api/js_snippets', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var params = req.body;

    db.js_snippets.saveNewSnippet(user, params, function(err, returnObj) {
      if(err){
        res.json({error: {code: "ErrorSavingNewSnippet"}});
      } else {
        res.json(returnObj);
      }
    });

  });

  app.put('/api/js_snippets/:snippet_id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var params = req.body;
    var action = params.action;

    //if set adds snippet to the urlEndpoint
    if (action === "saveEditInfo") {
      db.js_snippets.saveEditInfo(user, params, function(err, returnObj) {
        if (err) {
          res.json(err);
        } else {
          //empty object because we updated successfully
          res.json({});
        }
      });
    } else if (action === "saveCode") {
      db.js_snippets.saveCode(user, params, function(err, returnObj) {
        if(err){ 
          res.json({error: {code: "UnableToSaveCode"}});
        } else {
          res.json(returnObj);
        }
      });
    }
  });

  app.delete('/api/js_snippets/:snippet_id', passport.isAuthenticated(), function(req, res) {

    res.json({});

  });


  app.put('/api/active_snippets/:snippet_id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var params = req.body;
    var action = params.action;

    //if set adds snippet to the urlEndpoint
    if (action === "addSnippetToUrlEndpoint") {
      
      db.js_snippets.addSnippetToUrlEndpoint(user, params, function(err, returnObj) {
        if (err) {
          res.json(err);
        } else {
          res.json(returnObj);
        }
      });
    }
  });


  app.delete('/api/active_snippets/:active_snippet_id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;

    var active_snippet_id = req.params.active_snippet_id

    db.js_snippets.removeActiveSnippet(user, active_snippet_id, function(returnObj) {
      res.json(returnObj);
    });

  });




  return module;

}
