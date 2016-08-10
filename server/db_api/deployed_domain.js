module.exports = function(app, db) {

  return {

    getLoadTimeForEndpoint: function(user, params, callback) {
      var YSlow = require('yslowjs');

      var link = params.load_time_data.link;
      var url_endpoint_id = params.load_time_data.url_endpoint_id;
      var deployed_lander_id = params.id;
      var user_id = user.id;


      //deploy with this
      var yslow = new YSlow(link, ['--info', 'basic']);

      //testing this 
      // var yslow = new YSlow("landerds.com", ['--info', 'basic']);

      yslow.run(function(err, results) {
        if (err) {
          callback(err);
        } else {
          console.log("results: " + JSON.stringify(results));
          console.log("err: " + JSON.stringify(JSON.stringify(err)));

          var load_time = results.lt;
          var grade = results.o;

          //got load time now save in db

          db.getConnection(function(err, connection) {
            if (err) {
              callback(err);
            } else {
              connection.query("REPLACE INTO endpoint_load_times(user_id, url_endpoint_id, deployed_lander_id, load_time) VALUES(?,?,?,?);", [user_id, url_endpoint_id, deployed_lander_id, load_time],
                function(err, docs) {
                  if (err) {
                    callback(err);
                  } else {
                    callback(false, load_time);
                  }
                  connection.release();
                });
            }
          });
        }
      });
    }
  }
};
