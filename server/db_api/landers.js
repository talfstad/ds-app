module.exports = function(db) {

  var deferred = require('deferred');

  return {


    getAll: function(user, successCallback) {

      var user_id = user.id;

      var getActiveCampaignsForLander = function(lander, callback) {
        db.query("SELECT a.id,a.name,b.lander_id from campaigns a JOIN landers_with_campaigns b ON a.id=b.campaign_id WHERE (a.user_id = ? AND lander_id = ?)", [user_id, lander.id],
          function(err, dbActiveCampaigns) {
            callback(dbActiveCampaigns);
          });
      };


      getActiveJobsForDeployedLocation = function(deployedLocation, callback) {
        db.query("SELECT id,action,processing,done,error FROM jobs WHERE (user_id = ? AND action = ? AND lander_id = ? AND domain_id = ? AND processing = ?)", [user_id, "undeployLanderFromDomain", deployedLocation.lander_id, deployedLocation.id, true],
          function(err, dbActiveJobs) {
            callback(dbActiveJobs);
          });
      };

      var getDeployedLocationsForLander = function(lander, callback) {
        db.query("SELECT a.id,a.domain,b.lander_id from domains a JOIN deployed_landers b ON a.id=b.domain_id WHERE (a.user_id = ? AND lander_id = ?)", [user_id, lander.id],
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
          });
      };

      var getActiveSnippetsForUrlEndpoint = function(urlEndpoint, callback) {
        db.query("SELECT a.id, b.name FROM active_snippets a JOIN snippets b ON a.snippet_id=b.id WHERE (a.user_id = ? AND a.url_endpoint_id = ? AND a.lander_id = ?)", [user_id, urlEndpoint.id, urlEndpoint.lander_id],
          function(err, dbActiveSnippets) {
            callback(dbActiveSnippets);
          });
      };

      var getEndpointsForLander = function(lander, callback) {
        db.query("SELECT id,name,lander_id from url_endpoints WHERE (user_id = ? AND lander_id = ?)", [user_id, lander.id],
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
          });
      };


      var getExtraNestedForLander = function(lander, callback) {
        getEndpointsForLander(lander, function(endpoints) {

          lander.urlEndpoints = endpoints;

          getDeployedLocationsForLander(lander, function(deployedLocations) {

            lander.deployedLocations = deployedLocations;

            getActiveCampaignsForLander(lander, function(activeCampaigns) {

              lander.activeCampaigns = activeCampaigns;
              callback();

            });

          });

        });
      };

      var getAllLandersDb = function(gotLandersCallback) {
        db.query("SELECT id,name,optimize_css,optimize_js,optimize_images,optimize_gzip,last_updated FROM landers WHERE user_id = ?", [user_id], function(err, dblanders) {
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
          }
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
