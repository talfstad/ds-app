var config = require("../config");

var passport;

exports.initialize = function(app, db) {
  passport = require('passport');
  var Strategy = require('passport-local').Strategy;

  // Configure the local strategy for use by Passport.
  //
  // The local strategy require a `verify` function which receives the credentials
  // (`username` and `password`) submitted by the user.  The function must verify
  // that the password is correct and then invoke `cb` with a user object, which
  // will be set at `req.user` in route handlers after authentication.
  passport.use(new Strategy(
    function(username, password, cb) {
      db.users.findByUsername(username, password, function(err, user) {
        if (err) {
          return cb(false);
        }
        if (!user) {
          return cb(null, false);
        }
        return cb(null, user);
      });
    }));


  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  The
  // typical implementation of this is as simple as supplying the user ID when
  // serializing, and querying the user record by ID from the database when
  // deserializing.
  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });

  passport.deserializeUser(function(id, cb) {
    db.users.findById(id, function(err, user) {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });

  app.use(require('express-session')({
    secret: config.cookieSecret,
    resave: false,
    saveUninitialized: false
  }));

  // Initialize Passport and restore authentication state, if any, from the
  // session.
  app.use(passport.initialize());
  app.use(passport.session());
};

exports.authenticate = function() {
  return function(req, res, next) {
    passport.authenticate('local', function(err, user) {
      if (!user) {
        res.json({
          logged_in: false
        });
        return;
      }

      if (err) {
        res.json({
          logged_in: false
        });
        return;
      }

      //if we're here we're authenticated
      req.login(user, function(err) {
        if (err) {
          res.json({
            logged_in: false
          });
          return;
        }
        return next();
      });
    })(req, res, next);
  }

}

exports.isAuthenticated = function() {
  return function(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login');
    }
  }
}

return module;
