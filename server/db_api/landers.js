module.exports = function(db) {

  var deferred = require('deferred');

  return {

    //save optimzations and modified
    updateLanderData: function(user, attr, successCallback) {

      var user_id = user.id;
      var lander_id = attr.id;
      var optimized = attr.optimized;
      var modified = attr.modified;
      //values for query
      var attrArr = [optimized, modified, user_id, lander_id];

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("UPDATE landers SET optimized = ?, modified = ? WHERE user_id = ? AND id = ?", attrArr,
            function(err, docs) {

              if (err) {
                console.log(err);
                errorCallback();
              } else {
                successCallback({
                  id: attr.id
                });
              }
              connection.release();

            });
        }
      });
    },

    deleteLander: function(user_id, lander_id, successCallback, errorCallback) {

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("DELETE FROM landers WHERE user_id = ? AND id = ?", [user_id, lander_id], function(err, docs) {

            if (err) {
              console.log(err);
              errorCallback();
            } else {
              successCallback();
            }
            connection.release();

          });
        }
      });

    },

    addNewDuplicateLander: function(user, duplicateLanderAttributes, successCallback) {

      var user_id = user.id;
      var lander_name = duplicateLanderAttributes.name;
      var optimized = duplicateLanderAttributes.optimized;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("CALL save_new_duplicate_lander(?, ?, ?, ?, ?, ?)", [lander_name, user_id, optimized],
            function(err, docs) {
              if (err) {
                console.log(err);
              } else {
                //success

                //TODO copy all lander resources as well on duplicate lander (urlEndpoints, files, etc)


                duplicateLanderAttributes.id = docs[0][0]["LAST_INSERT_ID()"];
                duplicateLanderAttributes.last_updated = docs[1][0].last_updated;
                //remove any attributes we dont want to overwrite
                delete duplicateLanderAttributes.deployedLanders;
                delete duplicateLanderAttributes.activeJobs;
                delete duplicateLanderAttributes.activeCampaigns;
                delete duplicateLanderAttributes.urlEndpoints;

                successCallback(duplicateLanderAttributes);
              }
              connection.release();
            });
        }
      });


    },

    saveNewLander: function(user, landerName, successCallback) {

      var user_id = user.id;
      console.log("saving lander" + landerName + user_id);

      //param order: working_node_id, action, processing, lander_id, domain_id, campaign_id, user_id
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("CALL save_new_lander(?, ?)", [landerName, user_id],

            function(err, docs) {
              if (err) {
                console.log(err);
                errorCallback("Error registering new job in DB call");
              } else {
                var modelAttributes = {
                  name: landerName,
                  id: docs[0][0]["LAST_INSERT_ID()"],
                  last_updated: docs[1][0].last_updated
                };
                successCallback(modelAttributes);
              }
              connection.release();
            });
        }
      });

    },

    deployLanderToDomain: function(user, lander_id, domain_id, successCallback) {
      var user_id = user.id;

      //insert into deployed_landers

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("INSERT IGNORE INTO deployed_landers(user_id, lander_id, domain_id) VALUES (?, ?, ?);", [user_id, lander_id, domain_id], function(err, docs) {
            if (err) {
              console.log(err);
            } else {
              successCallback();
            }
            connection.release();
          });
        }
      });
    },

    undeployLanderFromDomain: function(user, lander_id, domain_id, successCallback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("DELETE FROM deployed_landers WHERE user_id = ? AND lander_id = ? AND domain_id = ?", [user_id, lander_id, domain_id], function(err, docs) {
            if (err) {
              console.log(err);
            } else {
              successCallback();
            }
            connection.release();
          });
        }
      });
    },

    getAll: function(user, successCallback, landersToGetArr) {

      var user_id = user.id;

      var getAllDeployedDomainsForCampaign = function(campaign, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          } else {
            connection.query("SELECT a.domain_id,b.domain FROM campaigns_with_domains a JOIN domains b ON a.domain_id = b.id WHERE (a.user_id = ? AND a.campaign_id = ?)", [user_id, campaign.campaign_id],
              function(err, dbDomainIdsForCampaign) {
                if (err) {
                  callback(err)
                } else {
                  callback(false, dbDomainIdsForCampaign);
                }
                connection.release();
              });
          }
        });
      };

      var getActiveJobsForActiveCampaign = function(activeCampaign, lander, callback) {
        var campaign_id = activeCampaign.campaign_id || activeCampaign.id;
        var lander_id = lander.id;
        //get all jobs attached to lander and make sure only select those. list is:
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          } else {
            connection.query("SELECT id,action,processing,lander_id,domain_id,campaign_id,done,error,created_on FROM jobs WHERE (user_id = ? AND campaign_id = ? AND lander_id = ? AND processing = ? AND (done IS NULL OR done = ?))", [user_id, campaign_id, lander_id, true, 0],
              function(err, dbActiveJobs) {
                if (err) {
                  callback(err);
                } else {
                  callback(false, dbActiveJobs);
                  connection.release();
                }

              });
          }
        });
      };

      getExtraNestedForActiveCampaign = function(activeCampaign, lander, callback) {
        getAllDeployedDomainsForCampaign(activeCampaign, function(err, deployedDomains) {
          if (err) {
            callback(err);
          } else {

            activeCampaign.deployedDomains = deployedDomains;

            getActiveJobsForActiveCampaign(activeCampaign, lander, function(err, activeJobs) {
              if (err) {
                callback(err);
              } else {
                activeCampaign.activeJobs = activeJobs;
                callback(false);
              }
            });
          }
        });
      };

      var getActiveCampaignsForLander = function(lander, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          }
          connection.query("SELECT a.id AS campaign_id, b.id, a.name,b.lander_id from campaigns a JOIN landers_with_campaigns b ON a.id=b.campaign_id WHERE (a.user_id = ? AND lander_id = ?)", [user_id, lander.id],
            function(err, dbActiveCampaigns) {

              if (dbActiveCampaigns.length <= 0) {
                callback(false, []);
              } else {
                var idx = 0;
                for (var i = 0; i < dbActiveCampaigns.length; i++) {
                  getExtraNestedForActiveCampaign(dbActiveCampaigns[i], lander, function(err) {
                    if (err) {
                      callback(err);
                    } else {
                      if (++idx == dbActiveCampaigns.length) {
                        callback(false, dbActiveCampaigns);
                      }
                    }

                  });
                }
              }
              connection.release();
            });
        });
      };

      var getActiveJobsFordeployedLander = function(deployedLander, callback) {
        //get all jobs attached to lander and make sure only select those. list is:
        // 1. deployLanderToDomain
        // 2. undeployLanderFromDomain
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT id,action,lander_id,domain_id,campaign_id,processing,done,error,created_on FROM jobs WHERE ((action = ? OR action = ?) AND user_id = ? AND lander_id = ? AND domain_id = ? AND processing = ?)", ["undeployLanderFromDomain", "deployLanderToDomain", user_id, deployedLander.lander_id, deployedLander.id, true],
              function(err, dbActiveJobs) {
                callback(false, dbActiveJobs);
                connection.release();
              });
          }
        });
      };

      var getdeployedLandersForLander = function(lander, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          } else {
            connection.query("SELECT a.id,a.domain,b.lander_id from domains a JOIN deployed_landers b ON a.id=b.domain_id WHERE (a.user_id = ? AND lander_id = ?)", [user_id, lander.id],
              function(err, dbDeployedLanders) {
                if (err) {
                  callback(err)
                } else {
                  if (dbDeployedLanders.length <= 0) {
                    callback(false, []);
                  } else {
                    var idx = 0;
                    for (var i = 0; i < dbDeployedLanders.length; i++) {
                      getActiveJobsFordeployedLander(dbDeployedLanders[i], function(activeJobs) {
                        var deployedLander = dbDeployedLanders[idx];
                        deployedLander.activeJobs = activeJobs;

                        if (++idx == dbDeployedLanders.length) {
                          callback(false, dbDeployedLanders);
                        }
                      });
                    }
                  }
                }
                connection.release();
              });
          }
        });
      };

      var getActiveSnippetsForUrlEndpoint = function(urlEndpoint, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT a.id, b.name, a.snippet_id FROM active_snippets a JOIN snippets b ON a.snippet_id=b.id WHERE (a.user_id = ? AND a.url_endpoint_id = ?)", [user_id, urlEndpoint.id],
              function(err, dbActiveSnippets) {
                callback(false, dbActiveSnippets);
                connection.release();
              });
          }
        });
      };

      var getEndpointsForLander = function(lander, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          } else {
            connection.query("SELECT id,name,lander_id from url_endpoints WHERE (user_id = ? AND lander_id = ?)", [user_id, lander.id],
              function(err, dbUrlEndpoints) {
                if (err) {
                  callback(err);
                } else {

                  if (dbUrlEndpoints.length <= 0) {
                    callback(false, []);
                  } else {
                    var idx = 0;
                    for (var i = 0; i < dbUrlEndpoints.length; i++) {
                      getActiveSnippetsForUrlEndpoint(dbUrlEndpoints[i], function(activeSnippets) {
                        var endpoint = dbUrlEndpoints[idx];
                        endpoint.activeSnippets = activeSnippets;
                        if (++idx == dbUrlEndpoints.length) {
                          callback(false, dbUrlEndpoints);
                        }
                      });
                    }
                  }
                }
                connection.release();
              });
          }
        });
      };

      var getActiveJobsForLander = function(lander, callback) {
        //get all jobs attached to lander and make sure only select those. list is:
        // 1. addNewLander
        // 2. deleteLander
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          } else {
            connection.query("SELECT id,action,lander_id,domain_id,campaign_id,processing,done,error,created_on FROM jobs WHERE ((action = ? OR action = ? OR action = ?) AND user_id = ? AND lander_id = ? AND processing = ?)", ["addNewLander", "deleteLander", "ripNewLander", user_id, lander.id, true],
              function(err, dbActiveJobs) {
                if (err) {
                  callback(err);
                } else {
                  callback(false, dbActiveJobs);
                  connection.release();
                }

              });
          }
        });
      };


      var getExtraNestedForLander = function(lander, callback) {
        getEndpointsForLander(lander, function(err, endpoints) {

          lander.urlEndpoints = endpoints;

          getdeployedLandersForLander(lander, function(err, deployedLanders) {
            if (err) {
              callback(err);
            } else {
              lander.deployedLanders = deployedLanders;

              getActiveCampaignsForLander(lander, function(err, activeCampaigns) {
                if (err) {
                  callback(err);
                } else {

                  lander.activeCampaigns = activeCampaigns;

                  getActiveJobsForLander(lander, function(err, activeJobsForLander) {
                    if (err) {
                      callback(err)
                    } else {
                      lander.activeJobs = activeJobsForLander;
                      callback(false);
                    }
                  });
                }
              });
            }

          });

        });
      };

      var getAllLandersDb = function(callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT id,name,optimized,modified,DATE_FORMAT(last_updated, '%b %e, %Y %l:%i:%s %p') AS last_updated FROM landers WHERE user_id = ?", [user_id], function(err, dblanders) {
              if (err) {
                callback(err);
              } else {
                var idx = 0;
                for (var i = 0; i < dblanders.length; i++) {
                  getExtraNestedForLander(dblanders[i], function() {

                    if (++idx == dblanders.length) {
                      callback(false, dblanders);
                    }

                  });
                }
                if (dblanders.length <= 0) {
                  callback(false, dblanders);
                }
              }
              connection.release();
            });
          }
        });
      };

      var getLandersById = function(landersToGetArr, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {

            var queryIds = "AND";
            for (var i = 0; i < landersToGetArr.length; i++) {
              queryIds += " id = " + landersToGetArr[i].lander_id
              if (i + 1 < landersToGetArr.length) {
                queryIds += " OR";
              }
            }

            var queryString = "SELECT id,name,optimized,modified,DATE_FORMAT(last_updated, '%b %e, %Y %l:%i:%s %p') AS last_updated FROM landers WHERE user_id = ? " + queryIds;

            connection.query(queryString, [user_id], function(err, dblanders) {
              if (err) {
                console.log(err);
              } else {
                var idx = 0;
                for (var i = 0; i < dblanders.length; i++) {
                  getExtraNestedForLander(dblanders[i], function() {

                    if (++idx == dblanders.length) {
                      callback(false, dblanders);
                    }

                  });
                }
                if (dblanders.length <= 0) {
                  callback(false, dblanders);
                }
              }
              connection.release();
            });
          }
        });
      };

      //if landersToGetArr is here then just get those landers. arr of objects with id as key
      if (landersToGetArr) {
        getLandersById(landersToGetArr, function(err, landers) {
          if(err) {
            return successCallback(err);
          } else {
            return successCallback(false, landers);            
          }
        });
      } else {
        //call to get all and return rows
        getAllLandersDb(function(err, landers) {
          if(err){
            return successCallback(err);
          } else {
            return successCallback(false, landers);
          }
        });
      }

    }
  }

};
