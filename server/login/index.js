var passport;
var ensure = require('connect-ensure-login');

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
      db.users.findByUsername(username, function(err, user) {
        if (err) {
          return cb(err);
        }
        if (!user) {
          return cb(null, false);
        }
        if (user.password != password) {
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


  // Initialize Passport and restore authentication state, if any, from the
  // session.
  app.use(passport.initialize());
  app.use(passport.session());
};

exports.authenticate = function() {

  return function(req, res, next) {
    req.moonlander = {};
    passport.authenticate('local', function(err, user, info) {
      if (!user) {
        res.json({
          logged_in: {
            status: user
          }
        });
        return;
      }

      if (err) {
        res.json({
          logged_in: {
            status: err
          }
        });
        return;
      }

      //if we're here we're authenticated
      req.logIn(user, function(err) {
        if (err) {
          res.json({
            logged_in: {
              status: err
            }
          });
          return;
        }
        req.moonlander.login = {
          status: true,
          username: user
        };
        return next();
      });
    })(req, res, next);
  }

}

exports.ensureLoggedIn = function() {
  return ensure.ensureLoggedIn();
}
