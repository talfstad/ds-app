module.exports = function(app, db) {


  var module = {

    getEndpointsForDeployedLander: function(user, deployedLander, callback) {
      var user_id = user.id;

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
    },

    getDeployedDomainsForDeployedLander: function(user, deployedLander, callback) {
      var user_id = user.id;

      var getLoadTimesForDeployedDomain = function(deployedDomain, callback) {
        var deployed_lander_id = deployedDomain.id;

        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT id,url_endpoint_id,load_time FROM endpoint_load_times WHERE deployed_lander_id = ? AND user_id = ?", [deployed_lander_id, user_id],
              function(err, dbLoadTimes) {
                callback(false, deployedDomain, dbLoadTimes);
                connection.release();
              });
          }
        });
      };

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("SELECT a.id AS domain_id,a.domain,b.id,b.lander_id from domains a JOIN deployed_landers b ON a.id=b.domain_id WHERE (b.user_id = ? AND lander_id = ?)", [user_id, deployedLander.lander_id],
            function(err, dbDeployedDomains) {
              if (err) {
                callback(err)
              } else {
                if (dbDeployedDomains.length <= 0) {
                  callback(false, []);
                } else {
                  var idx = 0;
                  for (var i = 0; i < dbDeployedDomains.length; i++) {
                    getLoadTimesForDeployedDomain(dbDeployedDomains[i], function(err, deployedDomain, loadTimes) {
                      deployedDomain.endpoint_load_times = loadTimes;
                      if (++idx == dbDeployedDomains.length) {
                        callback(false, dbDeployedDomains);
                      }
                    });
                  }
                }
              }
              connection.release();
            });
        }
      });

    },

    getExtraNestedForDeployedLander: function(user, deployedLander, domain, callback) {

      var user_id = user.id;

      var getActiveJobsForDeployedLander = function(deployedLander, callback) {
        var lander_id = deployedLander.lander_id;
        var domain_id = deployedLander.domain_id;

        //get all jobs attached to deployedLander and make sure only select those. list is:
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT id,action,processing,deploy_status,lander_id,domain_id,group_id,done,error,created_on FROM jobs WHERE ((action = ? OR action = ? OR action = ? OR action = ? OR action = ?) AND user_id = ? AND lander_id = ? AND domain_id = ? AND processing = ? AND (done IS NULL OR done = ?))", ["addNewLander", "deleteLander", "ripNewLander", "deployLanderToDomain", "undeployLanderFromDomain", user_id, lander_id, domain_id, true, 0],
              function(err, dbActiveJobs) {
                callback(false, dbActiveJobs);
                connection.release();
              });
          }
        });
      };





      var getActiveJobsForDeployedDomain = function(deployedDomain, callback) {
        //get all jobs attached to lander and make sure only select those. list is:
        // 1. deployLanderToDomain
        // 2. undeployLanderFromDomain
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            var arr = ["undeployLanderFromDomain", "deployLanderToDomain", user_id, deployedDomain.lander_id, deployedDomain.domain_id, true];
            connection.query("SELECT id,action,deploy_status,lander_id,domain_id,group_id,processing,done,error,created_on FROM jobs WHERE ((action = ? OR action = ?) AND user_id = ? AND lander_id = ? AND domain_id = ? AND processing = ?)", arr,
              function(err, dbActiveJobs) {
                callback(false, deployedDomain, dbActiveJobs);
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


      module.getEndpointsForDeployedLander(user, deployedLander, function(err, endpoints) {
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

                  module.getDeployedDomainsForDeployedLander(user, deployedLander, function(err, deployedDomains) {
                    deployedLander.deployedDomains = deployedDomains;
                    callback(false);
                  });
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
