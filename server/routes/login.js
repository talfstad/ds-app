exports.initialize = function(app, db, login) {

  app.post("/login", login.authenticate(), function(req, res) {
    //this is only executed if login succeeded
    if (req.body.remember) {
      req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
      req.session.cookie.expires = false;
    }
    res.json({
      logged_in: true
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};