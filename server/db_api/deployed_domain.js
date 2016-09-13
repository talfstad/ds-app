module.exports = function(app, db) {

  return {

    getLoadTimeForEndpoint: function(user, params, callback) {
      var YSlow = require('yslowjs');

      var link = params.load_time_data.link;
      var url_endpoint_id = params.load_time_data.url_endpoint_id;
      var deployed_lander_id = params.id;
      var user_id = user.id;

      app.log("getting load time for: " + link, "debug");
      //deploy with this
      var yslow = new YSlow(link, ['--info', 'basic']);

      yslow.run(function(err, results) {
        if (err) {
          //if run error it means the link 404'd. thats not so much an error as just the yslow failed.
          //since it can be run on the user interface we'll return success
          returnObj.load_time = "N/A";
          callback(false, responseObj);
        } else {
          var load_time = results.lt;
          var grade = results.o;

          //got load time now save in db
          db.getConnection(function(err, connection) {
            if (err) {
              callback(err);
            } else {
              connection.query("REPLACE INTO endpoint_load_times(user_id, url_endpoint_id, deployed_lander_id, load_time) VALUES(?,?,?,?);", [user_id, url_endpoint_id, deployed_lander_id, load_time],
                function(err, docs) {

                  var returnObj = {
                    url_endpoint_id: url_endpoint_id
                  };

                  if (err) {
                    returnObj.load_time = "N/A";
                    callback(err, responseObj);
                  } else {
                    returnObj.load_time = load_time;
                    callback(false, returnObj);
                  }
                  connection.release();
                });
            }
          });
        }
      });
    },

    removeFromDeployedLanders: function(user, lander_id, domain_id, callback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("DELETE FROM deployed_landers WHERE user_id = ? AND lander_id = ? AND domain_id = ?", [user_id, lander_id, domain_id], function(err, docs) {
            if (err) {
              callback(err);
            } else {
              callback(false);
            }
            connection.release();
          });
        }
      });
    },
  }
};
