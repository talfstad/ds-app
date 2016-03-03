module.exports = function(db) {

  var utils = require('../utils/utils.js')();
  var dbLanders = require('./landers.js')(db);

  return {

    removeFromLandersWithCampaigns: function(user, id, successCallback) {
      var user_id = user.id;
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("DELETE FROM landers_with_campaigns WHERE user_id = ? AND id = ?", [user_id, id],
            function(err, dbSuccessDelete) {

              successCallback(dbSuccessDelete);

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
          console.log(err);
        } else {
          connection.query("DELETE FROM campaigns_with_domains WHERE user_id = ? AND id = ?", [user_id, id],
            function(err, dbSuccessDelete) {

              successCallback(dbSuccessDelete);

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
              modelAttributes.active_campaign_id = docs[0][0]["LAST_INSERT_ID()"];

              var currentLanders = docs[1];

              //get current lander data by id
              dbLanders.getAll(user, function(currentLandersArr) {
                //add the current lander data and return!
                modelAttributes.currentLanders = currentLandersArr

                modelAttributes.id = modelAttributes.campaign_id;
                callback(modelAttributes);

              }, currentLanders);

            }

            //release connection
            connection.release();
          });
        }
      });
    },

    addActiveCampaign: function(user, modelAttributes, callback) {
      var user_id = user.id;

      // args: lander_id, campaign_id, user_id

      // [
      //   [{
      //     "LAST_INSERT_ID()": 48
      //   }],
      //   [{
      //     "domain_id": 1,
      //     "domain": "hardbodiesandboners.org"
      //   }, {
      //     "domain_id": 2,
      //     "domain": "weightlosskey.com"
      //   }, {
      //     "domain_id": 3,
      //     "domain": "notdeployed.com"
      //   }], {
      //     "fieldCount": 0,
      //     "affectedRows": 0,
      //     "insertId": 0,
      //     "serverStatus": 34,
      //     "warningCount": 0,
      //     "message": "",
      //     "protocol41": true,
      //     "changedRows": 0
      //   }
      // ]

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("CALL add_campaign_to_lander(?, ?, ?)", [modelAttributes.lander_id, modelAttributes.campaign_id, user_id], function(err, docs) {
            if (err) {
              console.log(err);
              callback("Error adding active campaign");
            } else {
              modelAttributes.active_campaign_id = docs[0][0]["LAST_INSERT_ID()"];
              modelAttributes.currentDomains = docs[1];
              modelAttributes.id = modelAttributes.campaign_id;
              callback(modelAttributes);
            }

            //release connection
            connection.release();
          });
        }
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
          connection.query("SELECT id,action,processing,done,error,created_on FROM jobs WHERE ((action = ? OR action = ?) AND user_id = ? AND campaign_id = ? AND domain_id = ? AND processing = ?)", ["undeployLanderFromDomain", "deployLanderToDomain", user_id, campaign.id, deployedDomain.id, true],
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
          connection.query("SELECT a.id,a.domain from domains a JOIN campaigns_with_domains b ON a.id=b.domain_id WHERE (a.user_id = ? AND campaign_id = ?)", [user_id, campaign.id],
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

      var getActiveJobsForLander = function(lander, campaign, callback) {
        var lander_id = lander.lander_id || lander.id;
        var campaign_id = campaign.id;

        //get all jobs attached to lander and make sure only select those. list is:
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          }
          connection.query("SELECT id,action,processing,done,error,created_on FROM jobs WHERE ((action = ? OR action = ?) AND user_id = ? AND lander_id = ? AND campaign_id = ? AND processing = ? AND done IS NULL OR done = ?)", ["deployLanderToDomain", "undeployLanderFromDomain", user_id, lander_id, campaign_id, true, 0],
            function(err, dbActiveJobs) {
              callback(false, dbActiveJobs);
              connection.release();
            });
        });
      };


      var getEndpointsForLander = function(lander, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          }
          connection.query("SELECT id,name,lander_id from url_endpoints WHERE (user_id = ? AND lander_id = ?)", [user_id, lander.id],
            function(err, dbUrlEndpoints) {
              if (err) {
                callback(err);
              } else {
                if (dbUrlEndpoints.length <= 0) {
                  callback(false, []);
                } else {
                  callback(false, dbUrlEndpoints);
                }
              }
              connection.release();
            });
        });
      };

      var getExtraNestedForLander = function(lander, campaign, callback) {
        getEndpointsForLander(lander, function(err, endpoints) {
          if (err) {
            callback(err);
          } else {
            console.log("got endpoints")
            lander.urlEndpoints = endpoints;

            getActiveJobsForLander(lander, campaign, function(err, activeJobs) {
              if (err) {
                callback(err);
              } else {
                console.log("got active jobs");
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
          connection.query("SELECT a.lander_id AS id, b.name FROM landers_with_campaigns a JOIN landers b ON a.lander_id = b.id WHERE (a.user_id = ? AND a.campaign_id = ?)", [user_id, campaign.id],
            function(err, dbLandersOnCampaign) {
              if (err) {
                callback(err);
              } else {
                var idx = 0;
                for (var i = 0; i < dbLandersOnCampaign.length; i++) {
                  getExtraNestedForLander(dbLandersOnCampaign[i], campaign, function(err) {
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
                callback(false);
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
                console.log(err);
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


      // [{
      //   "id": 1,
      //   "name": "default",
      //   "created_on": "",
      //   //change to campaignsDomains from campaignsDomainIds
      //   "deployedDomains": [{
      //     "id": 127,
      //     "domain": "ninedomain.com",
      //     "activeJobs": [] <-- includes any landers that are deploying to this domain and belong to this campaign
      //   }],
      //   //add campaignsLanders
      //   "deployedLanders": [{
      //     "id": 251,
      //     "name": "why why why",
      //     "urlEndpoints": [],
      //     "activeJobs": [] <- include any domains that are deploying to this lander and belong to this campaign
      //   }]
      // }]


      //on delete camp we need to remove all campaign landers from all domains on campaign so we create jobs to do that,
      //when that is finished we can remove the campaign

    }

  }

};
