module.exports = function(db) {

  var config = require('../config');

  return {

    //returns all processing jobs for campaign id
    getAllProcessingForCampaign: function(user, campaign_id, callback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("SELECT * FROM jobs WHERE user_id = ? AND campaign_id = ? AND action <> ? AND processing = ? AND (done IS NULL OR done = ?);", [user_id, campaign_id, "deleteCampaign", 1, 0],
            function(err, docs) {
              if (err) {
                callback(err);
              } else {
                callback(false, docs);
              }
              connection.release();
            });
        }
      });

    },

    //returns all jobs currently processing for user with specific domain and lander ids
    getAllProcessingForLanderDomain: function(user, attr, successCallback) {
      var user_id = user.id;
      var lander_id = attr.lander_id;
      var domain_id = attr.domain_id;


      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {

          connection.query("SELECT * FROM jobs WHERE user_id = ? AND domain_id = ? AND lander_id = ? AND processing = ? AND (done IS NULL OR done = ?)", [user_id, domain_id, lander_id, true, 0],

            function(err, docs) {
              if (err) {
                console.log(err);
              } else {

                successCallback(docs);

              }
              connection.release();
            });
        }
      });

    },

    getAllNotDoneForLanderDomain: function(user, attr, successCallback) {
      var user_id = user.id;
      var lander_id = attr.lander_id;
      var domain_id = attr.domain_id;


      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {

          connection.query("SELECT * FROM jobs WHERE user_id = ? AND domain_id = ? AND lander_id = ? AND (done IS NULL OR done = ?)", [user_id, domain_id, lander_id, 0],

            function(err, docs) {
              if (err) {
                console.log(err);
              } else {

                successCallback(docs);

              }
              connection.release();
            });
        }
      });

    },

    registerJob: function(user, modelAttributes, successCallback, errorCallback) {
      var user_id = user.id;

      //set processing true to start processing on response
      modelAttributes.processing = true;
      //param order: working_node_id, action, alternate_action, processing, lander_id, domain_id, campaign_id, user_id
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("CALL register_job(?, ?, ?, ?, ?, ?, ?, ?, ?)", [modelAttributes.deploy_status, config.id, modelAttributes.action, modelAttributes.alternate_action, true, modelAttributes.lander_id, modelAttributes.domain_id, modelAttributes.campaign_id, user_id],

            function(err, docs) {
              if (err) {
                console.log(err);
                errorCallback("Error registering new job in DB call");
              } else {
                modelAttributes.created_on = docs[1][0]["created_on"];
                modelAttributes.id = docs[0][0]["LAST_INSERT_ID()"];
                successCallback(modelAttributes);
              }
              connection.release();
            });
        }
      });
    },

    finishedJobSuccessfully: function(user, finishedJobs, successCallback, errorCallback) {
      var user_id = user.id;

      if (finishedJobs.length > 0) {
        //build sql command
        var finishedJobsValues = [true];

        var updateSql = "UPDATE jobs SET done = ? WHERE ";


        for (var i = 0; i < finishedJobs.length; i++) {
          updateSql = updateSql.concat("id = ?");

          if ((i + 1) < finishedJobs.length) {
            updateSql = updateSql.concat(" OR ");
          }

          finishedJobsValues.push(finishedJobs[i]);

          //update processing *guaranteed bc returning to client only on success*
          finishedJobs[i].processing = false;
        }


        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          }
          connection.query(updateSql, finishedJobsValues, function(err, docs) {
            if (err) {
              console.log(err);
              errorCallback("Error finishing processing on job in DB call")
            } else {
              //processing key updated above
              successCallback();
            }
            connection.release();
          });
        });
      } else {
        successCallback();
      }
    },

    updateDeployStatus: function(user, jobId, deployStatus, callback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("UPDATE jobs SET deploy_status = ? WHERE id = ? AND user_id = ?", [deployStatus, jobId, user_id], function(err, docs) {
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

    setErrorAndStop: function(code, errorJobId, callback) {
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        }
        connection.query("UPDATE jobs SET error = ?, error_code = ? WHERE id = ?", [true, code, errorJobId], function(err, docs) {
          if (err) {
            callback({
              code: err
            });
          } else {
            callback(false);
          }
          connection.release();
        });
      });
    },

    finishedProcessing: function(user, finishedJobs, successCallback, errorCallback) {
      var user_id = user.id;

      if (finishedJobs.length > 0) {
        //build sql command
        var finishedJobsValues = [false];

        var updateSql = "UPDATE jobs SET processing= ? WHERE ";


        for (var i = 0; i < finishedJobs.length; i++) {
          updateSql = updateSql.concat("id = ?");

          if ((i + 1) < finishedJobs.length) {
            updateSql = updateSql.concat(" OR ");
          }

          finishedJobsValues.push(finishedJobs[i].id);

          //update processing *guaranteed bc returning to client only on success*
          finishedJobs[i].processing = false;
        }

        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          }
          connection.query(updateSql, finishedJobsValues, function(err, docs) {
            if (err) {
              console.log(err);
              errorCallback("Error finishing processing on job in DB call")
            } else {
              //processing key updated above
              successCallback();
            }
            connection.release();
          });
        });
      } else {
        successCallback();
      }
    }
  }

};
