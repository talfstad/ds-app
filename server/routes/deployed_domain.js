module.exports = function(app, passport) {
  var module = {};

  var db = require("../db_api")(app);
  var uuid = require('uuid');


  app.put('/api/deployed_domain', passport.isAuthenticated(), function(req, res) {

    var user = req.user;
    var data = req.body;

    db.deployed_domain.getLoadTimeForEndpoint(user, data, function(err, responseObj) {
      if (err) {
        res.json(responseObj);
      } else {
        res.json(responseObj);
      }
    });

  });

  return module;

}
