module.exports = function(app, passport, dbApi) {
  var module = {};

  var controller = require("../controller")(app, dbApi);

  var csrf = require('csurf');
  app.use(csrf({
    cookie: true
  }));

  //always forward to https
  app.use(function requireHTTPS(req, res, next) {
    if (req.get('x-forwarded-proto') == 'http') {
      return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
  });

  require('./login')(app, passport, dbApi, controller);
  require('./landers/index')(app, passport, dbApi, controller);
  require('./groups')(app, passport, dbApi, controller);
  require('./domains')(app, passport, dbApi, controller);
  require('./js_snippets')(app, passport, dbApi, controller);
  require('./live_updater')(app, passport, dbApi, controller);
  require('./jobs')(app, passport, dbApi, controller);
  require('./user')(app, passport, dbApi, controller);
  require('./deployed_domain')(app, passport, dbApi, controller);
  require('./deployed_lander')(app, passport, dbApi, controller);

  app.get("*", function(req, res) {
    res.render('index', {
      csrfToken: req.csrfToken()
    });
  });



  return module;
}