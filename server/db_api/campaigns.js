module.exports = function(db) {

  var utils = require('../utils/utils.js')();
  var dbLanders = require('./landers.js')(db);

  return {


    updateCampaignName: function(user, campaignAttributes, callback) {

      var user_id = user.id;
      var name = campaignAttributes.name;
      var campaign_id = campaignAttributes.id;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        }
        connection.query("UPDATE campaigns SET name = ? WHERE user_id = ? AND id = ?", [name, user_id, campaign_id],
          function(err, docs) {
            if (err) {
              callback({
                code: "CouldNotUpdateCampNameIntoDb"
              });
            } else {
              callback(false, campaignAttributes);
            }
            connection.release();
          });
      });
    },

    addNewCampaign: function(user, newCampaignAttributes, callback) {

      //insert a new campaign 
      var user_id = user.id;
      var name = newCampaignAttributes.name;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        }
        connection.query("call insert_new_campaign(?, ?)", [user_id, name],
          function(err, docs) {
            if (err) {
              callback({
                code: "CouldNotInsertCampIntoDb"
              });
            } else {
              //don't send back deployedLanders or deployedDomains because it will overwrite the collections
              delete newCampaignAttributes.deployedLanders;
              delete newCampaignAttributes.deployedDomains;
              delete newCampaignAttributes.activeJobs;

              newCampaignAttributes.created_on = docs[1][0]["created_on"];
              newCampaignAttributes.id = docs[0][0]["LAST_INSERT_ID()"];
              callback(false, newCampaignAttributes);
            }
            connection.release();
          });
      });

    },

    deleteCampaign: function(user, id, callback) {
      var user_id = user.id;
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("DELETE FROM campaigns WHERE user_id = ? AND id = ?", [user_id, id],
            function(err, dbSuccessDelete) {

              callback(false, dbSuccessDelete);

              //release connection
              connection.release();
            });
        }
      });
    },

    removeFromLandersWithCampaigns: function(user, id, callback) {
      var user_id = user.id;
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("DELETE FROM landers_with_campaigns WHERE user_id = ? AND id = ?", [user_id, id],
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

    removeFromCampaignsWithDomains: function(user, id, successCallback) {
      var user_id = user.id;
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("DELETE FROM campaigns_with_domains WHERE user_id = ? AND id = ?", [user_id, id],
            function(err, dbSuccessDelete) {
              if (err) {
                callback(err);
              } else {
                successCallback(false, dbSuccessDelete);
              }
              //release connection
              connection.release();
            });
        }
      });

    },

    addActiveCampaignToDomain: function(user, modelAttributes, callback) {

      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("CALL add_domain_to_campaign(?, ?, ?)", [modelAttributes.domain_id, modelAttributes.campaign_id, user_id], function(err, docs) {
            if (err) {
              console.log(err);
              callback("Error adding active campaign");
            } else {
              modelAttributes.id = docs[0][0]["LAST_INSERT_ID()"];

              var deployedLanders = docs[1];

              delete modelAttributes.activeJobs;
              delete modelAttributes.deployedDomains;
              delete modelAttributes.deployedLanders;

              //get current lander data by id
              if (deployedLanders.length > 0) {

                dbLanders.getAll(user, function(deployedLandersArr) {
                  //add the current lander data and return!

                  modelAttributes.deployedLanders = deployedLandersArr

                  callback(modelAttributes);

                }, deployedLanders);

              } else {

                modelAttributes.deployedLanders = []

                callback(modelAttributes);

              }

            }

            //release connection
            connection.release();
          });
        }
      });
    },

    addActiveCampaignToLander: function(user, modelAttributes, callback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("CALL add_campaign_to_lander(?, ?, ?)", [modelAttributes.lander_id, modelAttributes.campaign_id, user_id], function(err, docs) {
            if (err) {
              console.log(err);
              callback("Error adding active campaign");
            } else {
              modelAttributes.id = docs[0][0]["LAST_INSERT_ID()"];
              modelAttributes.currentDomains = docs[1];

              delete modelAttributes.activeJobs;

              callback(modelAttributes);
            }

            //release connection
            connection.release();
          });
        }
      });

    },

    getActiveCampaignsForLander: function(user, lander, callback) {
      this.getAll(user, function(err, campaigns) {

        var activeCampaigns = [];

        for (var i = 0; i < campaigns.length; i++) {

          //loop deployed landers on each campaign and push if deployed lander matches lander we're looking for
          var deployedLanders = campaigns[i].deployedLanders;

          for (var j = 0; j < deployedLanders.length; j++) {

            var lander_id = lander.lander_id || lander.id;

            if (deployedLanders[j].lander_id == lander_id) {
              activeCampaigns.push(deployedLanders[j]);
            }
          }
        }

        callback(activeCampaigns);

      });
    },

    getAll: function(user, callback) {

      var user_id = user.id;

      var getActiveJobsForDeployedDomain = function(deployedDomain, campaign, callback) {
        //get all jobs attached to lander and make sure only select those. list is:
        // 1. deployLanderToDomain
        // 2. undeployLanderFromDomain
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          }
          connection.query("SELECT id,action,processing,done,error,lander_id,domain_id,campaign_id,created_on FROM jobs WHERE user_id = ? AND campaign_id = ? AND domain_id = ? AND processing = ? AND (done IS NULL OR done = ?)", [user_id, campaign.id, deployedDomain.domain_id, true, 0],
            function(err, dbActiveJobs) {
              if (err) {
                callback(err);
              } else {
                callback(false, dbActiveJobs);
                connection.release();
              }
            });
        });
      };

      var getDeployedDomainsForCampaign = function(campaign, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          }
          connection.query("SELECT a.id AS domain_id,a.domain,b.id from domains a JOIN campaigns_with_domains b ON a.id=b.domain_id WHERE (a.user_id = ? AND campaign_id = ?)", [user_id, campaign.id],
            function(err, dbDeployedDomains) {
              if (err) {
                callback(err);
              } else {
                var idx = 0;
                for (var i = 0; i < dbDeployedDomains.length; i++) {
                  getActiveJobsForDeployedDomain(dbDeployedDomains[i], campaign, function(err, activeJobs) {
                    if (err) {
                      callback(err);
                    } else {
                      var deployedLander = dbDeployedDomains[idx];
                      deployedLander.activeJobs = activeJobs;

                      if (++idx == dbDeployedDomains.length) {
                        callback(false, dbDeployedDomains);
                      }
                    }
                  });
                }
                if (dbDeployedDomains.length <= 0) {
                  callback(false, []);
                }
              }
              connection.release();
            });
        });
      };

      var getActiveJobsForCampaign = function(campaign, callback) {
        //get all jobs attached to domain and make sure only select those. list is:
        // 1. deleteDomain
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          }
          connection.query("SELECT id,action,processing,done,error,lander_id,domain_id,campaign_id,created_on FROM jobs WHERE action = ? AND user_id = ? AND campaign_id = ? AND processing = ? AND (done IS NULL OR done = ?)", ["deleteCampaign", user_id, campaign.id, true, 0],
            function(err, dbActiveJobs) {
              if (err) {
                callback(err);
                console.log(err);
              } else {
                if (dbActiveJobs <= 0) {
                  callback(false, []);
                } else {
                  callback(false, dbActiveJobs);
                }
              }

              connection.release();
            });
        });
      };

      var getActiveJobsForDeployedLander = function(lander, campaign, callback) {
        var lander_id = lander.lander_id || lander.id;
        var campaign_id = campaign.id;

        //get all jobs attached to lander and make sure only select those. list is:
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          }
          connection.query("SELECT id,action,processing,done,error,lander_id,domain_id,campaign_id,created_on FROM jobs WHERE user_id = ? AND lander_id = ? AND campaign_id = ? AND processing = ? AND (done IS NULL OR done = ?)", [user_id, lander_id, campaign_id, true, 0],
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

      var getExtraNestedForDeployedLander = function(lander, campaign, callback) {
        getEndpointsForDeployedLander(lander, function(err, endpoints) {
          if (err) {
            callback(err);
          } else {
            lander.urlEndpoints = endpoints;
            getActiveJobsForDeployedLander(lander, campaign, function(err, activeJobs) {
              if (err) {
                callback(err);
              } else {
                lander.activeJobs = activeJobs;
                callback(false);
              }

            });

          }

        });
      };

      var getDeployedLandersForCampaign = function(campaign, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          }
          connection.query("SELECT a.id, b.id AS lander_id, b.name FROM landers_with_campaigns a JOIN landers b ON a.lander_id = b.id WHERE (a.user_id = ? AND a.campaign_id = ?)", [user_id, campaign.id],
            function(err, dbLandersOnCampaign) {
              if (err) {
                callback(err);
              } else {
                var idx = 0;
                for (var i = 0; i < dbLandersOnCampaign.length; i++) {
                  getExtraNestedForDeployedLander(dbLandersOnCampaign[i], campaign, function(err) {
                    if (err) {
                      callback(err);
                    } else {
                      if (++idx == dbLandersOnCampaign.length) {
                        callback(false, dbLandersOnCampaign);
                      }
                    }
                  });
                }
                if (dbLandersOnCampaign.length <= 0) {
                  callback(false, []);
                }
              }
              connection.release();
            });
        });
      };

      var getExtraNestedForCampaign = function(campaign, callback) {

        getDeployedLandersForCampaign(campaign, function(err, landers) {
          if (err) {
            callback(err);
          } else {
            campaign.deployedLanders = landers;
            getDeployedDomainsForCampaign(campaign, function(err, domains) {
              if (err) {
                callback(err);
              } else {
                campaign.deployedDomains = domains;

                getActiveJobsForCampaign(campaign, function(err, activeJobs) {
                  if (err) {
                    callback(err);
                  } else {
                    campaign.activeJobs = activeJobs;
                    callback(false);
                  }
                });

              }

            });
          }

        });
      };

      var getAllCampaignsDb = function(callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          }
          connection.query("SELECT id,name,DATE_FORMAT(created_on, '%b %e, %Y %l:%i:%s %p') AS created_on FROM campaigns WHERE user_id = ?", [user_id],
            function(err, dbCampaigns) {
              if (err) {
                callback(err);
              } else {
                var idx = 0;
                for (var i = 0; i < dbCampaigns.length; i++) {
                  getExtraNestedForCampaign(dbCampaigns[i], function(err) {
                    if (err) {
                      callback(err);
                    } else {
                      if (++idx == dbCampaigns.length) {
                        callback(false, dbCampaigns);
                      }
                    }


                  });
                }
                if (dbCampaigns.length <= 0) {
                  callback(false, []);
                }
              }
              //release connection
              connection.release();
            });
        });
      };

      //call to get all and return rows
      getAllCampaignsDb(function(err, campaigns) {
        if (err) {
          return callback(err);
        } else {
          return callback(false, campaigns);
        }
      });


    }

  }

};
