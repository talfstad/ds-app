module.exports = function(app, db) {


  var dbLanders = require('./landers')(app, db);
  var baseDeployedLander = require('./base_classes/base_deployed_lander')(app, db);

  var module = _.extend(baseDeployedLander, {

    updateGroupName: function(user, groupAttributes, callback) {

      var user_id = user.id;
      var name = groupAttributes.name;
      var group_id = groupAttributes.id;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("UPDATE groups SET name = ? WHERE user_id = ? AND id = ?", [name, user_id, group_id],
            function(err, docs) {
              if (err) {
                callback({
                  code: "CouldNotUpdateCampNameIntoDb"
                });
              } else {
                callback(false, groupAttributes);
              }
              connection.release();
            });
        }

      });
    },

    addNewGroup: function(user, newGroupAttributes, callback) {

      //insert a new group 
      var user_id = user.id;
      var name = newGroupAttributes.name;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("call insert_new_group(?, ?)", [user_id, name],
            function(err, docs) {
              if (err) {
                callback({
                  code: "CouldNotInsertCampIntoDb"
                });
              } else {
                //don't send back deployedLanders or deployedDomains because it will overwrite the collections
                delete newGroupAttributes.deployedLanders;
                delete newGroupAttributes.activeJobs;
                delete newGroupAttributes.domains;

                newGroupAttributes.created_on = docs[1][0]["created_on"];
                newGroupAttributes.id = docs[0][0]["LAST_INSERT_ID()"];
                callback(false, newGroupAttributes);
              }
              connection.release();
            });
        }
      });
    },

    deleteGroup: function(user, id, callback) {
      var user_id = user.id;
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("DELETE FROM groups WHERE user_id = ? AND id = ?", [user_id, id],
            function(err, dbSuccessDelete) {

              callback(false, dbSuccessDelete);

              //release connection
              connection.release();
            });
        }
      });
    },

    removeFromLandersWithGroups: function(user, id, callback) {
      var user_id = user.id;
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("DELETE FROM landers_with_groups WHERE user_id = ? AND id = ?", [user_id, id],
            function(err, dbSuccessDelete) {
              if (err) {
                callback(err);
              } else {
                callback(dbSuccessDelete);
              }

              //release connection
              connection.release();
            });
        }
      });

    },

    removeFromGroupsWithDomains: function(user, id, callback) {
      var user_id = user.id;
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("DELETE FROM groups_with_domains WHERE user_id = ? AND id = ?", [user_id, id],
            function(err, dbSuccessDelete) {
              if (err) {
                callback(err);
              } else {
                callback(false, dbSuccessDelete);
              }
              //release connection
              connection.release();
            });
        }
      });

    },

    addActiveGroupToDomain: function(user, modelAttributes, callback) {

      var user_id = user.id;
      var group_id = modelAttributes.group_id || modelAttributes.id;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("CALL add_domain_to_group(?, ?, ?)", [modelAttributes.domain_id, group_id, user_id], function(err, docs) {
            if (err) {
              callback(err);
            } else {
              var active_group_id = docs[0][0]["LAST_INSERT_ID()"];
              callback(false, active_group_id);
            }

            //release connection
            connection.release();
          });
        }
      });
    },

    addActiveGroupToLander: function(user, modelAttributes, callback) {
      var user_id = user.id;

      var group_id = modelAttributes.group_id || modelAttributes.id;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("CALL add_group_to_lander(?, ?, ?)", [modelAttributes.lander_id, group_id, user_id], function(err, docs) {
            if (err) {
              callback(err);
            } else {
              var active_group_id = docs[0][0]["LAST_INSERT_ID()"];
              callback(false, active_group_id);
            }

            //release connection
            connection.release();
          });
        }
      });

    },

    getActiveGroupsForLander: function(user, lander, callback) {
      this.getAll(user, function(err, groups) {

        var activeGroups = [];

        for (var i = 0; i < groups.length; i++) {

          //loop deployed landers on each group and push if deployed lander matches lander we're looking for
          var deployedLanders = groups[i].deployedLanders;

          for (var j = 0; j < deployedLanders.length; j++) {

            var lander_id = lander.lander_id || lander.id;

            if (deployedLanders[j].lander_id == lander_id) {
              activeGroups.push(deployedLanders[j]);
            }
          }
        }

        callback(false, activeGroups);

      });
    },

    getAll: function(user, callback) {

      var user_id = user.id;

      var getDomainsForGroup = function(group, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT b.id, a.id AS domain_id,a.domain from domains a JOIN groups_with_domains b ON a.id=b.domain_id WHERE b.user_id = ? AND b.group_id = ?", [user_id, group.id],
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

      var getActiveJobsForGroup = function(group, callback) {
        //get all jobs attached to domain and make sure only select those. list is:
        // 1. deleteDomain
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT id,action,processing,deploy_status,done,error,lander_id,domain_id,group_id,created_on FROM jobs WHERE action = ? AND user_id = ? AND group_id = ? AND processing = ? AND (done IS NULL OR done = ?)", ["deleteGroup", user_id, group.id, true, 0],
              function(err, dbActiveJobs) {
                if (err) {
                  callback(err);
                } else {
                  if (dbActiveJobs <= 0) {
                    callback(false, []);
                  } else {
                    callback(false, dbActiveJobs);
                  }
                }
                connection.release();
              });
          }
        });
      };

      var getActiveJobsForDeployedLander = function(lander, group, callback) {
        var lander_id = lander.lander_id || lander.id;

        //get all jobs attached to lander and make sure only select those. list is:
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          }
          connection.query("SELECT DISTINCT jobs.id,action,processing,deploy_status,done,error,lander_id,jobs.domain_id,created_on FROM groups_with_domains b INNER JOIN jobs ON jobs.domain_id = b.domain_id WHERE jobs.user_id = ? AND lander_id = ? AND processing = ? AND (done = ?)", [user_id, lander_id, true, false],
            function(err, dbActiveJobs) {
              callback(false, dbActiveJobs);
              connection.release();
            });
        });
      };


      var getEndpointsForDeployedLander = function(lander, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT id,filename,lander_id from url_endpoints WHERE (user_id = ? AND lander_id = ?)", [user_id, lander.lander_id],
              function(err, dbUrlEndpoints) {
                if (err) {
                  callback(err);
                } else {
                  callback(false, dbUrlEndpoints);
                }
                connection.release();
              });
          }
        });
      };

      var getExtraNestedForDeployedLander = function(lander, group, callback) {
        module.getEndpointsForDeployedLander(user, lander, function(err, endpoints) {
          if (err) {
            callback(err);
          } else {
            lander.urlEndpoints = endpoints;
            getActiveJobsForDeployedLander(lander, group, function(err, activeJobs) {
              if (err) {
                callback(err);
              } else {

                lander.activeJobs = activeJobs;
              
                module.getDeployedDomainsForDeployedLander(user, lander, function(err, deployedDomains) {
                  lander.deployedDomains = deployedDomains;
                  callback(false);
                });
              }
            });
          }
        });
      };

      var getDeployedLandersForGroup = function(group, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT a.id, b.id AS lander_id, b.modified, b.deployment_folder_name, b.name FROM landers_with_groups a JOIN landers b ON a.lander_id = b.id WHERE (a.user_id = ? AND a.group_id = ?)", [user_id, group.id],
              function(err, dbLandersOnGroup) {
                if (err) {
                  callback(err);
                } else {
                  var idx = 0;
                  for (var i = 0; i < dbLandersOnGroup.length; i++) {
                    getExtraNestedForDeployedLander(dbLandersOnGroup[i], group, function(err) {
                      if (err) {
                        callback(err);
                      } else {
                        if (++idx == dbLandersOnGroup.length) {
                          callback(false, dbLandersOnGroup);
                        }
                      }
                    });
                  }
                  if (dbLandersOnGroup.length <= 0) {
                    callback(false, []);
                  }
                }
                connection.release();
              });
          }
        });
      };

      var getExtraNestedForGroup = function(group, callback) {

        getDomainsForGroup(group, function(err, dbDomains) {
          if (err) {
            callback(err);
          } else {
            group.domains = dbDomains;

            getDeployedLandersForGroup(group, function(err, landers) {
              if (err) {
                callback(err);
              } else {
                group.deployedLanders = landers;
                callback(false);
              }
            });
          }
        });

      };

      var getAllGroupsDb = function(callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT id,name,DATE_FORMAT(created_on, '%b %e, %Y %l:%i:%s %p') AS created_on FROM groups WHERE user_id = ?", [user_id],
              function(err, dbGroups) {
                if (err) {
                  callback(err);
                } else {
                  var idx = 0;
                  if (dbGroups.length > 0) {
                    for (var i = 0; i < dbGroups.length; i++) {
                      getExtraNestedForGroup(dbGroups[i], function(err) {
                        if (err) {
                          callback(err);
                        } else {
                          if (++idx == dbGroups.length) {
                            callback(false, dbGroups);
                          }
                        }
                      });
                    }
                  } else {
                    callback(false, []);
                  }
                }
                //release connection
                connection.release();
              });
          }
        });
      };

      //call to get all and return rows
      getAllGroupsDb(function(err, groups) {
        if (err) {
          return callback(err);
        } else {
          return callback(false, groups);
        }
      });


    }

  });

  return module;
};
