module.exports = function(app, db) {


  var module = {

    getExtraNestedForDeployedLander: function(user, deployedLander, domain, callback) {
      
      var user_id = user.id;

      var getActiveJobsForDeployedLander = function(deployedLander, callback) {
        var lander_id = deployedLander.lander_id;
        var domain_id = deployedLander.domain_id;

        //get all jobs attached to deployedLander and make sure only select those. list is:
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
            callback(err);
          } else {
            connection.query("SELECT id,action,processing,deploy_status,lander_id,domain_id,campaign_id,done,error,created_on FROM jobs WHERE ((action = ? OR action = ? OR action = ? OR action = ? OR action = ?) AND user_id = ? AND lander_id = ? AND domain_id = ? AND processing = ? AND (done IS NULL OR done = ?))", ["addNewLander", "deleteLander", "ripNewLander", "deployLanderToDomain", "undeployLanderFromDomain", user_id, lander_id, domain_id, true, 0],
              function(err, dbActiveJobs) {
                callback(false, dbActiveJobs);
                connection.release();
              });
          }
        });
      };

      var getEndpointsForDeployedLander = function(deployedLander, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT id,filename,lander_id from url_endpoints WHERE (user_id = ? AND lander_id = ?)", [user_id, deployedLander.lander_id],
              function(err, dbUrlEndpoints) {
                if (dbUrlEndpoints.length <= 0) {
                  callback(false, []);
                } else {
                  callback(false, dbUrlEndpoints);
                }
                connection.release();
              });
          }
        });
      };

      var getLoadTimesForDeployedLander = function(deployedLander, callback) {
        var deployed_lander_id = deployedLander.id;

        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT id,url_endpoint_id,load_time FROM endpoint_load_times WHERE deployed_lander_id = ? AND user_id = ?", [deployed_lander_id, user_id],
              function(err, dbLoadTimes) {
                callback(false, dbLoadTimes);
              });
          }
          connection.release();
        });
      };


      getEndpointsForDeployedLander(deployedLander, function(err, endpoints) {
        if (err) {
          callback(err);
        } else {
          deployedLander.urlEndpoints = endpoints;

          getActiveJobsForDeployedLander(deployedLander, function(err, activeJobs) {
            if (err) {
              callback(err);
            } else {
              deployedLander.activeJobs = activeJobs;

              getLoadTimesForDeployedLander(deployedLander, function(err, loadTimes) {
                if (err) {
                  callback(err);
                } else {
                  deployedLander.endpoint_load_times = loadTimes;
                  callback(false);
                }
              });
            }
          });
        }
      });
    }

  }
  return module;
};
