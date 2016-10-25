module.exports = function(app, db, base) {

  var module = {};

  module.rip = require('./rip')(app, db, base);
  module.add_lander = require('./add_lander')(app, db, base);
  module.fatal = require('./fatal')(app, db, base);

  module.getFixedLanders = function(callback) {
    var getFixedRipLanders = function(callback) {
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("SELECT * FROM ds_log_rip_errors a JOIN user_settings b ON a.user_id = b.user_id WHERE a.fixed = ?", [true],
            function(err, dbfixedRip) {
              if (err) {
                callback(err);
              } else {
                callback(false, dbfixedRip);
              }
              connection.release();
            });
        }
      });
    };
    var getFixedAddLanders = function(callback) {
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("SELECT * FROM ds_log_add_lander_errors a JOIN user_settings b ON a.user_id = b.user_id WHERE a.fixed = ?", [true],
            function(err, dbFixedAdd) {
              if (err) {
                callback(err);
              } else {
                callback(false, dbFixedAdd);
              }
              connection.release();
            });
        }
      });
    };

    getFixedAddLanders(function(err, fixedAddLanders) {
      getFixedRipLanders(function(err, getFixedRipLanders) {
        callback(false, {
          add: fixedAddLanders,
          rip: getFixedRipLanders
        })
      });
    });
  };


  module.deleteAllFixedLanders = function(callback) {

    var deleteFixedRipLanders = function(callback) {
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("DELETE FROM ds_log_rip_errors WHERE fixed = ?", [true],
            function(err) {
              if (err) {
                callback(err);
              } else {
                callback(false);
              }
              connection.release();
            });
        }
      });
    };
    var deleteFixedAddLanders = function(callback) {
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("DELETE FROM ds_log_add_lander_errors WHERE fixed = ?", [true],
            function(err) {
              if (err) {
                callback(err);
              } else {
                callback(false);
              }
              connection.release();
            });
        }
      });
    };

    deleteFixedRipLanders(function(err) {
      deleteFixedAddLanders(function(err) {
        callback(false);
      });
    });
  };


  return module;

}
