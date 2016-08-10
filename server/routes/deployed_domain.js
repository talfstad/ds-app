module.exports = function(app, passport) {
  var module = {};

  var db = require("../db_api")(app);
  var uuid = require('uuid');


  app.put('/api/deployed_domain', passport.isAuthenticated(), function(req, res) {

    var user = req.user;

    var data = req.body;
    var link = data.load_time_link;

    db.deployed_domain.getLoadTimeForEndpoint(user, data, function(err, loadTime) {
      if (err) {
        res.json({loadTime: "N/A"})
      } else {
        res.json({loadTime: loadTime})
      }
    });

  });

  return module;

}
