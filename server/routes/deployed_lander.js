module.exports = function(app, passport, dbApi, controller) {
  var module = {};

  var uuid = require('uuid');

  app.put('/api/deployed_lander', passport.isAuthenticated(), function(req, res) {

    var user = req.user;

    var data = req.body;

    dbApi.deployed_domain.getLoadTimeForEndpoint(user, data, function(err, responseObj) {
      if (err) {
        res.json(responseObj);
      } else {
        res.json(responseObj);
      }
    });

  });

  return module;

}
