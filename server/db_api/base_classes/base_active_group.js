module.exports = function(app, db) {


  var module = {

    getExtraNestedForActiveGroup: function(user, activeGroup, callback) {

      var user_id = user.id;

      var getAllLandersOnActiveGroup = function(activeGroup, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT a.lander_id,b.name FROM landers_with_groups a JOIN landers b ON a.lander_id = b.id WHERE (a.user_id = ? AND a.group_id = ?)", [user_id, activeGroup.group_id],
              function(err, dbLanders) {
                if (err) {
                  callback(err);
                } else {
                  callback(false, dbLanders);
                }
                connection.release();
              });
          }
        });
      };

      var getAllDomainsOnActiveGroup = function(activeGroup, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT a.domain_id,b.domain FROM groups_with_domains a JOIN domains b ON a.domain_id = b.id WHERE (a.user_id = ? AND a.group_id = ?)", [user_id, activeGroup.group_id],
              function(err, dbDomains) {
                if (err) {
                  callback(err);
                } else {
                  callback(false, dbDomains);
                }
                connection.release();
              });
          }
        });
      };

      getAllDomainsOnActiveGroup(activeGroup, function(err, dbDomains) {
        if (err) {
          callback(err);
        } else {
          activeGroup.domains = dbDomains;

          getAllLandersOnActiveGroup(activeGroup, function(err, dbLanders) {
            if (err) {
              callback(err);
            } else {

              activeGroup.landers = dbLanders;
              callback(false);
            }
          });
        }
      });
    }

  };
  return module;
};
