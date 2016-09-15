module.exports = function(app, passport) {
  var module = {};

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

  require('./login')(app, passport);
  require('./landers/index')(app, passport);
  require('./groups')(app, passport);
  require('./domains')(app, passport);
  require('./js_snippets')(app, passport);
  require('./live_updater')(app, passport);
  require('./jobs')(app, passport);
  require('./user')(app, passport);
  require('./deployed_domain')(app, passport);
  require('./deployed_lander')(app, passport);

  app.get("*", function(req, res) {
    res.render('index', {
      csrfToken: req.csrfToken()
    });
  });



  return module;
}
