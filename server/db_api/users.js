module.exports = function(db) {

  var bcrypt = require("bcrypt-nodejs");

  return {
    findById: function(id, cb) {
      db.query("SELECT * FROM users WHERE id = ?", [id], function(err, userDocs) {
        if (err) {
          console.log(err);
          cb("Error looking up user id", null);
        } else {
          if (!userDocs[0]) {
            cb("Error looking up user id", null);
          } else {
            var user_row = userDocs[0];
            cb(null, user_row);
          }
        }
      });
    },

    findByUsername: function(username, password, cb) {
      
      db.query("SELECT * FROM users WHERE user = ?", [username], function(err, userDocs) {
        if (err) {
          console.log(err);
          cb("Error looking up user", null);
        } else {
          if (!userDocs[0]) {
            cb("Invalid user or password", null);
          } else {
            var user_row = userDocs[0];
            if (bcrypt.compareSync(password, user_row.hash)) {
              cb(null, user_row);
            }
          }
        }
      });
    },

    addUser: function(req, res) {
      db.query("INSERT INTO users(user, hash, approved) VALUES (?, ?, ?)", [req.body.username, bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8)), 0], function(err, rows) {
        if (err) {
          console.log(err);
          res.json({
            error: "Username has been taken.",
            field: "username"
          });
        } else {
          // Retrieve the inserted user data
          db.query("SELECT * FROM users WHERE user = ?", [req.body.username], function(err, rows) {
            if (rows.length == 1) {
              var row = rows[0];
              // Set the user cookies and return the cleansed user data
              res.json({
                user: row
              });
            } else {
              console.log(err, rows);
              res.json({
                error: "Error while trying to register user."
              });
            }
          });
        }
      });
    }
  }

};
