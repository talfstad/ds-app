exports.initialize = function(app, db, login) {

  var login_routes = require('./login');
  login_routes.initialize(app, db, login);


  app.get("*", function(req, res) {
    res.render('index' /*, { csrfToken: req.csrfToken() }*/ );
  });
}