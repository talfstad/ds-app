module.exports = function(app, db) {

  return {

    checkIfExternalInterrupt: function(user, job_id, callback) {
      app.log("checking for job interrupt: " + job_id + " user: " + user.id, "debug");
      if (!job_id) {
        callback(false, false);
        return;
      }

      var user_id = user.id;

      var checkJobExternalInterrupt = function() {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT error, error_code FROM jobs WHERE user_id = ? AND id = ?", [user_id, job_id],
              function(err, docs) {
                if (err) {
                  callback(err);
                } else {
                  var jobInfo = docs[0];
                  if (jobInfo) {
                    if (jobInfo.error && jobInfo.error_code == "ExternalInterrupt") {
                      callback(false, true);
                    } else {
                      callback(false, false);
                    }
                  } else {
                    callback(false, false);
                  }
                }
                connection.release();
              });
          }
        });
      };

      checkJobExternalInterrupt();

    },

    cancelAnyCurrentRunningJobsOnDomain: function(user, domain_id, callback) {
      var user_id = user.id;

      var externalInterruptAllJobsWithDomainId = function(callback) {

        app.log("\n\n\n\nCanceling all jobs with domain_id : " + domain_id, "debug");

        var query = "";
        var arr = [];
        //also include deployLanderToDomain jobs if we're undeploying
        query = "UPDATE jobs SET error = ?, error_code = ?, processing = ? WHERE user_id = ? AND domain_id = ? AND done = ?";
        arr = [true, "ExternalInterrupt", false, user_id, domain_id, false];

        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query(query, arr,
              function(err, docs) {
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

      externalInterruptAllJobsWithDomainId(callback);
    },

    cancelAnyCurrentRunningJobsOnLander: function(user, lander_id, callback) {
      var user_id = user.id;

      var externalInterruptAllJobsWithLanderId = function(callback) {

        app.log("\n\n\n\nCanceling all jobs with lander_id : " + lander_id, "debug");

        var query = "";
        var arr = [];
        //also include deployLanderToDomain jobs if we're undeploying
        query = "UPDATE jobs SET error = ?, error_code = ?, processing = ? WHERE user_id = ? AND lander_id = ? AND done = ?";
        arr = [true, "ExternalInterrupt", false, user_id, lander_id, false];

        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query(query, arr,
              function(err, docs) {
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

      externalInterruptAllJobsWithLanderId(callback);

    },

    cancelAnyCurrentRunningDuplicateJobs: function(user, list, callback) {
      if (!list) {
        callback(false);
        return;
      }

      //if undeploy job, cancel deploy jobs as well

      var user_id = user.id;

      var ExternalInterruptJob = function(job, callback) {
        app.log("\n\n\n\n11111 heres the job trying to cancel?? : " + JSON.stringify(job) + "\n\n\n", "debug");

        var query = "";
        var arr = [];
        if (job.action == "undeployLanderFromDomain" || job.action == "deployLanderToDomain") {
          //also include deployLanderToDomain jobs if we're undeploying
          query = "UPDATE jobs SET error = ?, error_code = ?, processing = ? WHERE user_id = ? AND lander_id = ? AND domain_id = ? AND (action = ? OR action = ?) AND done = ?";
          arr = [true, "ExternalInterrupt", false, user_id, job.lander_id, job.domain_id, "undeployLanderFromDomain", "deployLanderToDomain", false];

          db.getConnection(function(err, connection) {
            if (err) {
              callback(err);
            } else {
              connection.query(query, arr,
                function(err, docs) {
                  if (err) {
                    callback(err);
                  } else {
                    callback(false);
                  }
                  connection.release();
                });
            }
          });

        } else {
          callback(false);
        }

      };

      if (list.length > 0) {
        var asyncIndex = 0;
        for (var i = 0; i < list.length; i++) {
          ExternalInterruptJob(list[i], function(err) {
            if (err) {
              callback(err);
            } else {
              if (++asyncIndex == list.length) {
                callback(false);
              }
            }
          });
        }
      } else {
        callback(false);
      }
    },

    //returns all processing jobs for campaign id
    getAllProcessingForCampaign: function(user, campaign_id, callback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
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

    addStagingPathToJob: function(staging_path, job_id, callback) {

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("UPDATE jobs set staging_path = ? WHERE id = ?;", [staging_path, job_id],
            function(err, docs) {
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

    //returns all jobs currently processing for user with specific domain and lander ids
    getAllProcessingForLanderDomain: function(user, attr, callback) {
      var user_id = user.id;
      var lander_id = attr.lander_id;
      var domain_id = attr.domain_id;


      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {

          connection.query("SELECT * FROM jobs WHERE user_id = ? AND domain_id = ? AND lander_id = ? AND processing = ? AND (done IS NULL OR done = ?)", [user_id, domain_id, lander_id, true, 0],

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

    getSlaveJobsStillWorking: function(user, masterJobId, callback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          var arr = [masterJobId, false, user_id];
          connection.query("SELECT * FROM jobs WHERE master_job_id = ? AND done = ? AND user_id = ?", arr,
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
    getJob: function(user, id, callback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {

          connection.query("SELECT * FROM jobs WHERE user_id = ? AND id = ?", [user_id, id],
            function(err, docs) {
              if (err) {
                callback(err);
              } else {
                callback(false, docs[0]);
              }
              connection.release();
            });
        }
      });

    },

    getAllNotDoneForLanderDomain: function(user, attr, callback) {
      var user_id = user.id;
      var lander_id = attr.lander_id;
      var domain_id = attr.domain_id;


      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {

          connection.query("SELECT * FROM jobs WHERE user_id = ? AND domain_id = ? AND lander_id = ? AND (done IS NULL OR done = ?)", [user_id, domain_id, lander_id, 0],

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

    registerJob: function(user, modelAttributes, callback) {
      var user_id = user.id;

      //set processing true to start processing on response
      modelAttributes.processing = true;
      //param order: working_node_id, action, alternate_action, processing, lander_id, domain_id, campaign_id, user_id
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("CALL register_job(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [modelAttributes.deploy_status, app.config.id, modelAttributes.action, modelAttributes.alternate_action, true, modelAttributes.lander_id, modelAttributes.domain_id, modelAttributes.campaign_id, user_id, modelAttributes.master_job_id],
            function(err, docs) {
              if (err) {
                callback(err);
              } else {
                modelAttributes.created_on = docs[1][0]["created_on"];
                modelAttributes.id = docs[0][0]["LAST_INSERT_ID()"];
                callback(false, modelAttributes);
              }
              connection.release();
            });
        }
      });
    },

    finishedJobSuccessfully: function(user, finishedJobs, callback) {
      var user_id = user.id;

      if (finishedJobs.length > 0) {
        //build sql command
        var finishedJobsValues = [false, true];

        var updateSql = "UPDATE jobs SET processing = ?, done = ? WHERE ";


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
            callback(err);
          } else {
            connection.query(updateSql, finishedJobsValues, function(err, docs) {
              if (err) {
                callback(err);
              } else {
                //processing key updated above
                callback();
              }
            });
          }
          connection.release();
        });
      } else {
        callback();
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


    updateDeployStatusForJobs: function(user, jobs, deployStatus, callback) {
      var user_id = user.id;
      var me = this;

      if (jobs.length > 0) {
        var asyncIndex = 0;
        _.each(jobs, function(job) {
          me.updateDeployStatus(user, job.id, deployStatus, function(err) {
            if (++asyncIndex == jobs.length) {
              callback(false);
            }
          });
        });
      } else {
        callback(false);
      }

    },

    setErrorAndStop: function(code, errorJobId, callback) {
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
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

    finishedProcessing: function(user, finishedJobs, callback) {
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
            callback(err);
          }
          connection.query(updateSql, finishedJobsValues, function(err, docs) {
            if (err) {
              callback(err);
            } else {
              //processing key updated above
              callback(false);
            }
            connection.release();
          });
        });
      } else {
        callback(false);
      }
    }
  }

};
