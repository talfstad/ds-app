module.exports = function(db) {

  var deferred = require('deferred');

  return {

    deleteLander: function(user_id, lander_id, successCallback, errorCallback) {

      db.getConnection(function(err, connection) {

        connection.query("DELETE FROM landers WHERE user_id = ? AND id = ?", [user_id, lander_id], function(err, docs) {

          if (err) {
            console.log(err);
            errorCallback();
          } else {
            successCallback();
          }

        });
        connection.release();
      });

    },

    addNewDuplicateLander: function(user, duplicateLanderAttributes, successCallback) {

      var user_id = user.id;
      var lander_name = duplicateLanderAttributes.name;
      var optimize_js = duplicateLanderAttributes.optimize_js;
      var optimize_css = duplicateLanderAttributes.optimize_css;
      var optimize_images = duplicateLanderAttributes.optimize_images;
      var optimize_gzip = duplicateLanderAttributes.optimize_gzip;

      db.getConnection(function(err, connection) {
        connection.query("CALL save_new_duplicate_lander(?, ?, ?, ?, ?, ?)", [lander_name, user_id, optimize_js, optimize_css, optimize_images, optimize_gzip],
          function(err, docs) {
            if (err) {
              console.log(err);
            } else {
              //success

              //TODO copy all lander resources as well on duplicate lander (urlEndpoints, files, etc)


              duplicateLanderAttributes.id = docs[0][0]["LAST_INSERT_ID()"];
              duplicateLanderAttributes.last_updated = docs[1][0].last_updated;
              //remove any attributes we dont want to overwrite
              delete duplicateLanderAttributes.deployedLocations;
              delete duplicateLanderAttributes.activeJobs;
              delete duplicateLanderAttributes.activeCampaigns;
              delete duplicateLanderAttributes.urlEndpoints;

              successCallback(duplicateLanderAttributes);
            }

          });
      });


    },

    saveNewLander: function(user, landerName, successCallback) {

      var user_id = user.id;
      console.log("saving lander" + landerName + user_id);

      //param order: working_node_id, action, processing, lander_id, domain_id, campaign_id, user_id
      db.getConnection(function(err, connection) {
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
      });

    },

    deployLanderToDomain: function(user, lander_id, domain_id, successCallback) {
      var user_id = user.id;

      //insert into deployed_landers

      db.getConnection(function(err, connection) {
        connection.query("INSERT INTO deployed_landers(user_id, lander_id, domain_id) VALUES (?, ?, ?);", [user_id, lander_id, domain_id], function(err, docs) {
          if (err) {
            console.log(err);
          } else {
            successCallback();
          }
          connection.release();
        });
      });
    },

    undeployLanderFromDomain: function(user, lander_id, domain_id, successCallback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        connection.query("DELETE FROM deployed_landers WHERE user_id = ? AND lander_id = ? AND domain_id = ?", [user_id, lander_id, domain_id], function(err, docs) {
          if (err) {
            console.log(err);
          } else {
            successCallback();
          }
          connection.release();
        });
      });
    },

    getAll: function(user, successCallback) {

      var user_id = user.id;

      getAllDomainIdsForCampaign = function(campaign, callback) {
        db.getConnection(function(err, connection) {
          connection.query("SELECT a.domain_id,b.domain FROM campaigns_with_domains a JOIN domains b ON a.domain_id = b.id WHERE (a.user_id = ? AND a.campaign_id = ?)", [user_id, campaign.id],
            function(err, dbDomainIdsForCampaign) {
              callback(dbDomainIdsForCampaign);
              connection.release();
            });
        });
      };

      var getActiveCampaignsForLander = function(lander, callback) {
        db.getConnection(function(err, connection) {
          connection.query("SELECT a.id, b.id AS active_campaign_id, a.name,b.lander_id from campaigns a JOIN landers_with_campaigns b ON a.id=b.campaign_id WHERE (a.user_id = ? AND lander_id = ?)", [user_id, lander.id],
            function(err, dbActiveCampaigns) {

              if (dbActiveCampaigns.length <= 0) {
                callback([]);
              } else {
                var idx = 0;
                for (var i = 0; i < dbActiveCampaigns.length; i++) {
                  getAllDomainIdsForCampaign(dbActiveCampaigns[i], function(currentDomains) {
                    var deployedLander = dbActiveCampaigns[idx];
                    deployedLander.currentDomains = currentDomains;

                    if (++idx == dbActiveCampaigns.length) {
                      callback(dbActiveCampaigns);
                    }
                  });
                }
              }
              connection.release();
            });
        });
      };


      getActiveJobsForDeployedLocation = function(deployedLocation, callback) {
        //get all jobs attached to lander and make sure only select those. list is:
        // 1. deployLanderToDomain
        // 2. undeployLanderFromDomain
        db.getConnection(function(err, connection) {
          connection.query("SELECT id,action,processing,done,error FROM jobs WHERE ((action = ? OR action = ?) AND user_id = ? AND lander_id = ? AND domain_id = ? AND processing = ?)", ["undeployLanderFromDomain", "deployLanderToDomain", user_id, deployedLocation.lander_id, deployedLocation.id, true],
            function(err, dbActiveJobs) {
              callback(dbActiveJobs);
              connection.release();
            });
        });
      };

      var getDeployedLocationsForLander = function(lander, callback) {
        db.getConnection(function(err, connection) {
          connection.query("SELECT a.id,a.domain,b.lander_id from domains a JOIN deployed_landers b ON a.id=b.domain_id WHERE (a.user_id = ? AND lander_id = ?)", [user_id, lander.id],
            function(err, dbDeployedLanders) {
              if (dbDeployedLanders.length <= 0) {
                callback([]);
              } else {
                var idx = 0;
                for (var i = 0; i < dbDeployedLanders.length; i++) {
                  getActiveJobsForDeployedLocation(dbDeployedLanders[i], function(activeJobs) {
                    var deployedLander = dbDeployedLanders[idx];
                    deployedLander.activeJobs = activeJobs;

                    if (++idx == dbDeployedLanders.length) {
                      callback(dbDeployedLanders);
                    }
                  });
                }
              }
              connection.release();
            });
        });
      };

      var getActiveSnippetsForUrlEndpoint = function(urlEndpoint, callback) {
        db.getConnection(function(err, connection) {
          connection.query("SELECT a.id, b.name FROM active_snippets a JOIN snippets b ON a.snippet_id=b.id WHERE (a.user_id = ? AND a.url_endpoint_id = ? AND a.lander_id = ?)", [user_id, urlEndpoint.id, urlEndpoint.lander_id],
            function(err, dbActiveSnippets) {
              callback(dbActiveSnippets);
              connection.release();
            });
        });
      };

      var getEndpointsForLander = function(lander, callback) {
        db.getConnection(function(err, connection) {
          connection.query("SELECT id,name,lander_id from url_endpoints WHERE (user_id = ? AND lander_id = ?)", [user_id, lander.id],
            function(err, dbUrlEndpoints) {
              if (dbUrlEndpoints.length <= 0) {
                callback([]);
              } else {
                var idx = 0;
                for (var i = 0; i < dbUrlEndpoints.length; i++) {
                  getActiveSnippetsForUrlEndpoint(dbUrlEndpoints[i], function(activeSnippets) {
                    var endpoint = dbUrlEndpoints[idx];
                    endpoint.activeSnippets = activeSnippets;
                    if (++idx == dbUrlEndpoints.length) {
                      callback(dbUrlEndpoints);
                    }
                  });
                }
              }
              connection.release();
            });
        });
      };

      getActiveJobsForLander = function(lander, callback) {
        //get all jobs attached to lander and make sure only select those. list is:
        // 1. addNewLander
        db.getConnection(function(err, connection) {
          connection.query("SELECT id,action,processing,done,error FROM jobs WHERE ((action = ? OR action = ?) AND user_id = ? AND lander_id = ? AND processing = ?)", ["addNewLander", "deleteLander", user_id, lander.id, true],
            function(err, dbActiveJobs) {
              callback(dbActiveJobs);
              connection.release();
            });
        });
      };


      var getExtraNestedForLander = function(lander, callback) {
        getEndpointsForLander(lander, function(endpoints) {

          lander.urlEndpoints = endpoints;

          getDeployedLocationsForLander(lander, function(deployedLocations) {

            lander.deployedLocations = deployedLocations;

            getActiveCampaignsForLander(lander, function(activeCampaigns) {

              lander.activeCampaigns = activeCampaigns;

              getActiveJobsForLander(lander, function(activeJobsForLander) {
                lander.activeJobs = activeJobsForLander;
                callback();

              });

            });

          });

        });
      };

      var getAllLandersDb = function(gotLandersCallback) {
        db.getConnection(function(err, connection) {
          connection.query("SELECT id,name,optimize_css,optimize_js,optimize_images,optimize_gzip,DATE_FORMAT(last_updated, '%b %e, %Y %l:%i:%s %p') AS last_updated FROM landers WHERE user_id = ?", [user_id], function(err, dblanders) {
            if (err) {
              throw err;
            } else {
              var idx = 0;
              for (var i = 0; i < dblanders.length; i++) {
                getExtraNestedForLander(dblanders[i], function() {

                  if (++idx == dblanders.length) {
                    gotLandersCallback(dblanders);
                  }

                });
              }
              if (dblanders.length <= 0) {
                gotLandersCallback(dblanders);
              }
            }
            connection.release();
          });
        });
      };


      //call to get all and return rows
      getAllLandersDb(function(landers) {
        return successCallback(landers);
      });



      ///////MOCK DATA FOR GET ALL LANDERS ////////////      
      // [{
      //   "id": 1,
      //   "name": "test lander 1",
      //   "optimize_css": 1,
      //   "optimize_js": 1,
      //   "optimize_images": 0,
      //   "optimize_gzip": 0,
      //   "last_updated": "2015-04-15T07:00:00.000Z",
      //   "urlEndpoints": [{
      //     "id": 1,
      //     "name": "index.html",
      //     "lander_id": 1,
      //     "activeSnippets": []
      //   }],
      //   "deployedLocations": [{
      //     "id": 1,
      //     "domain": "hardbodiesandboners.org",
      //     "lander_id": 1,
      //     "activeJobs": []
      //   }],
      //   "activeCampaigns": []
      // }, {
      //   "id": 2,
      //   "name": "test lander 2",
      //   "optimize_css": 0,
      //   "optimize_js": 0,
      //   "optimize_images": 1,
      //   "optimize_gzip": 1,
      //   "last_updated": "2015-03-15T19:30:00.000Z",
      //   "urlEndpoints": [{
      //     "id": 2,
      //     "name": "index.html",
      //     "lander_id": 2,
      //     "activeSnippets": [{
      //       "id": 3,
      //       "name": "JS No-referrer"
      //     }]
      //   }, {
      //     "id": 5,
      //     "name": "index1.html",
      //     "lander_id": 2,
      //     "activeSnippets": [{
      //       "id": 4,
      //       "name": "test"
      //     }]
      //   }],
      //   "deployedLocations": [{
      //     "id": 1,
      //     "domain": "hardbodiesandboners.org",
      //     "lander_id": 2,
      //     "activeJobs": []
      //   }, {
      //     "id": 2,
      //     "domain": "weightlosskey.com",
      //     "lander_id": 2,
      //     "activeJobs": []
      //   }],
      //   "activeCampaigns": [{
      //     "id": 1,
      //     "name": "default",
      //     "lander_id": 2
      //   }, {
      //     "id": 2,
      //     "name": "camp1",
      //     "lander_id": 2
      //   }]
      // }, {
      //   "id": 3,
      //   "name": "test lander 3",
      //   "optimize_css": 0,
      //   "optimize_js": 1,
      //   "optimize_images": 1,
      //   "optimize_gzip": 0,
      //   "last_updated": "2015-05-31T19:30:00.000Z",
      //   "urlEndpoints": [{
      //     "id": 3,
      //     "name": "index.html",
      //     "lander_id": 3,
      //     "activeSnippets": []
      //   }],
      //   "deployedLocations": [{
      //     "id": 2,
      //     "domain": "weightlosskey.com",
      //     "lander_id": 3,
      //     "activeJobs": []
      //   }],
      //   "activeCampaigns": []
      // }, {
      //   "id": 4,
      //   "name": "test lander 4",
      //   "optimize_css": 1,
      //   "optimize_js": 0,
      //   "optimize_images": 0,
      //   "optimize_gzip": 1,
      //   "last_updated": "2015-06-15T19:30:00.000Z",
      //   "urlEndpoints": [{
      //     "id": 4,
      //     "name": "index.html",
      //     "lander_id": 4,
      //     "activeSnippets": []
      //   }],
      //   "deployedLocations": [],
      //   "activeCampaigns": []
      // }]

    }
  }

};
