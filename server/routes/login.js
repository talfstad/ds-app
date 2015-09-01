exports.initialize = function(app, db, login) {

  app.post("/api/login", login.authenticate(), function(req, res) {
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

  app.get('/api/login', function(req, res){
    if (req.user) {
        // logged in
        res.json({logged_in: true});
    } else {
        // not logged in
        res.json({logged_in: false});
    }
  });

  app.get('/api/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.post("/api/login/signup", function(req, res) {
    db.users.addUser(req, res);
  });

};