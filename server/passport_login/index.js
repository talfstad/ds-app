var passport;
var uuid = require('uuid');
var db;

exports.initialize = function(app, db_ref) {
  db = db_ref;
  passport = require('passport');
  
  var Strategy = require('passport-local').Strategy;
  var expressSession = require('express-session');
  var RedisStore = require('connect-redis')(expressSession);

  // Configure the local strategy for use by Passport.
  //
  // The local strategy require a `verify` function which receives the credentials
  // (`username` and `password`) submitted by the user.  The function must verify
  // that the password is correct and then invoke `cb` with a user object, which
  // will be set at `req.user` in route handlers after authentication.
  passport.use(new Strategy(
    function(username, password, cb) {
      db.users.findByUsernamePasword(username, password, function(err, user) {
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
    var data = {
      id: user.id,
      auth_token: user.auth_token
    };

    cb(null, data);
  });

  passport.deserializeUser(function(user, cb) {
    db.users.findByIdAndAuth(user.id, user.auth_token, function(err, user) {
      if (err) {
        return cb(null, false);
      }
      if (!user) {
        return cb(null, false);
      }

      cb(null, user);
    });
  });
  
  app.use(expressSession({
    store: new RedisStore(app.config.redisConnectionInfo),
    secret: app.config.cookieSecret,
    resave: false,
    cookie: { _expires: app.config.cookieMaxAge },
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
      //make an auth token
      user.auth_token = uuid.v4();
      db.users.setAuthToken(user.id, user.auth_token, function(err) {
        if (err) {
          app.log("auth error : " + JSON.stringify(err), "debug");
          return;
        } else {
          req.login(user, function(err) {
            if (err) {
              res.json({
                logged_in: false
              });
            } else {
              return next();
            }
          });
        }
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

