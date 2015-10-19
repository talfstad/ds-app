module.exports = function(db) {

  var deferred = require('deferred');

  return {


    getAll: function(user, successCallback) {
      //overallstrategy
      //1. create master deferred object
      //2. create functions that are async and return promises
      //3. resolve on group and return

      var user_id = user.id;

      var getAllLandersDb = function() {
        //create deferred return the promise for it
        var defer = deferred();
        db.query("SELECT id,name,optimizations,last_updated FROM landers WHERE user_id = ?", [user_id], function(err, dblanders) {
          if (err) {
            throw err;
          } else {
            //when function done, call resolve on the promise
            defer.resolve(dblanders);
          }
        });
        return defer.promise;
      };

      var addEndpointsToLanders = function(landers) {
        var defer = deferred();

        if (landers.length <= 0) {
          //no landers so resolve before doing anything
          defer.resolve();
        } else {

          //loop landers
          var iterateLandersIdx = 0; //async index counter
          for (var i = 0; i < landers.length; i++) {

            var lander_row_id = landers[i].id;
            landers[i].urlEndpoints = []; //init blank array for endpoints

            db.query("SELECT id,name,lander_id from url_endpoints WHERE (user_id = ? AND lander_id = ?)", [user_id, lander_row_id],
              function(err, dbUrlEndpoints) {
                //no endpoints
                if (dbUrlEndpoints.length <= 0) {
                  if (++iterateLandersIdx == landers.length) {
                    // console.log("no endpoints resolve");
                    defer.resolve();
                  }
                } else {
                  //we have endpoints
                  var iterateEndpointsIdx = 0; //keep track of async endpoint index
                  for (var j = 0; j < dbUrlEndpoints.length; j++) {

                    var url_endpoint_id = dbUrlEndpoints[j].id;
                    var url_endpoint_lander_id = dbUrlEndpoints[j].lander_id;
                    
                    db.query("SELECT a.id, b.name FROM active_snippets a JOIN snippets b ON a.snippet_id=b.id WHERE (a.user_id = ? AND a.url_endpoint_id = ? AND a.lander_id = ?)", [user_id, url_endpoint_id, url_endpoint_lander_id],
                      function(err, dbActiveSnippets) {
                        
                        //Working HANDLES to async array locations
                        //always get this inside your async function to gurantee correct index
                        var lander = landers[iterateLandersIdx]; 
                        var endpoint = dbUrlEndpoints[iterateEndpointsIdx]; //handle to current endpoint we're working on

                        //WORK IF HAS snippets for endpoint
                        if (dbActiveSnippets.length > 0) {
                          endpoint.activeSnippets = [];
                          for (var snippetIdx = 0; snippetIdx < dbActiveSnippets.length; snippetIdx++) {
                            endpoint.activeSnippets.push(dbActiveSnippets[snippetIdx]);
                          }
                        }
                        
                        lander.urlEndpoints.push(endpoint);
                        
                        if (++iterateEndpointsIdx == dbUrlEndpoints.length) {
                          //done with endpoints for lander check if we're all done
                          if(++iterateLandersIdx == landers.length) {
                            defer.resolve();
                          }
                        }

                      });
                  }
                }
              });
          }
        }
        return defer.promise;
      };

      var addDeployedLocationsToLanders = function(landers) {
        var defer = deferred();

        if (landers.length <= 0) {
          //no landers so resolve before doing anything
          defer.resolve();
        } else {

          //loop landers
          var iterateLandersIdx = 0; //async index counter
          for (var i = 0; i < landers.length; i++) {

            var lander_row_id = landers[i].id;
            landers[i].deployedLocations = []; //init blank array for endpoints

            db.query("SELECT a.id,a.lander_id,b.domain FROM deployed_landers a JOIN domains b ON a.domain_id=b.id WHERE (a.user_id = ? AND a.lander_id = ?)", [user_id, lander_row_id],
              function(err, deployedLandersDb) {
                //no endpoints
                console.log("\nOKOK: " + JSON.stringify(deployedLandersDb));

                if (deployedLandersDb.length <= 0) {
                  if (++iterateLandersIdx == landers.length) {
                    console.log("not deployed resolve");
                    defer.resolve();
                  }
                } else {
                  //lander is deployed in locations
                  var iterateDeployedLocationsIdx = 0; //keep track of async deployed location index
                  for (var j = 0; j < deployedLandersDb.length; j++) {

                    var deployed_location_id = deployedLandersDb[j].id;
                    var lander_id = deployedLandersDb[j].lander_id;
                    
                    //query all active jobs that should be loaded for deployed domains models
                    db.query("SELECT id, action, processing, done, error FROM jobs WHERE (user_id = ? AND lander_id = ? AND action = ? AND processing=?)", [user_id, deployed_location_id, lander_id, "undeployLanderFromDomain", 1],
                      function(err, dbActiveJobs) {

                        // console.log("\nJOBS: " + JSON.stringify(dbActiveJobs));
                        
                        //Working HANDLES to async array locations
                        //always get this inside your async function to gurantee correct index
                        var lander = landers[iterateLandersIdx]; 
                        var deployedLocation = deployedLandersDb[iterateDeployedLocationsIdx]; //handle to current deployed location we're working on
                        
                        //WORK IF HAS actrive jobs for deployed location
                        if (dbActiveJobs.length > 0) {
                          deployedLocation.activeJobs = [];
                          for (var jobsIdx = 0; jobsIdx < dbActiveJobs.length; jobsIdx++) {
                            deployedLocation.activeJobs.push(dbActiveJobs[jobsIdx]);
                          }
                        }


                        lander.deployedLocations.push(deployedLocation);
                        
                        console.log("\nlander: " + JSON.stringify(lander) + "\n\n");


                        if (++iterateDeployedLocationsIdx == deployedLandersDb.length) {
                          //done with endpoints for lander check if we're all done
                          if(++iterateLandersIdx == landers.length) {
                            console.log("deployed resolve");

                            defer.resolve();
                          }
                        }

                      });
                  }
                }
              });
          }
        }
        return defer.promise;
      };

      var getAllLandersDbPromise = getAllLandersDb();

      //callback ran on success of get all landers
      getAllLandersDbPromise(function(landers) {
        //call components that need landers data
        //return promises 

        var addEndpointsToLandersPromise = addEndpointsToLanders(landers);
        addEndpointsToLandersPromise(function(){
        
          var addDeployedLocationsToLandersPromise = addDeployedLocationsToLanders(landers);
        
          addDeployedLocationsToLandersPromise(function(){
        
            console.log("\nreturn rows: \n" + JSON.stringify(landers));
            successCallback(null, returnRows);
          });
        
        })
      });

      //runs when all promises are resolved





      //data is get all lander data for user

      // db.query("SELECT * FROM landers WHERE user_id = ?", [user_id], function(err, dblanders) {

      //   for (var i = 0; i < dblanders.length; i++) {
      //     var lander_row = {};

      //     lander_row.id = dblanders[i].id;
      //     lander_row.name = dblanders[i].name;
      //     lander_row.last_updated = dblanders[i].last_updated;
      //     lander_row.optimizations = JSON.parse(dblanders[i].optimizations);
      //     lander_row.urlEndpoints = [];

      //     var addEndpointsToResponse = function(err, dbendpoints) {

      //     };

      //     db.query("SELECT * from url_endpoints WHERE user_id = ? AND lander_id = ?", [user_id, lander_row.id], addEndpointsToResponse);
      //   }

      // });


      // var mockData = [{


      //   //looping create this part first
      //   "id": 1,
      //   "name": "test lander 1",
      //   "lastUpdated": "3-2-15",
      //   "optimizations": {
      //     "gzip": true,
      //     "optimizeJs": false,
      //     "optimizeCss": true,
      //     "optimizeImg": true
      //   },




      //   //new query all url endpoints for lander
      //   "urlEndpoints": [{
      //     "id": 1,
      //     "name": "index.html",
      //     "activeSnippetIds": '["1","2"]',

      //     //new query key off activeSnippetIds from urlEndpoints and loop active snippet rows. add to activeSnippets. 
      //     //remove activeSnippetIds from return row
      //     "activeSnippets": [{
      //       "code": "this is the snippet code",
      //       "id": 2,
      //       "name": "JS Cloaker",
      //       "last_updated": "3-2-15"
      //     }, {
      //       "id": 1,
      //       "name": "JS No-referrer",
      //       "code": "this is snippet code",
      //       "last_updated": "3-1-15"
      //     }]
      //   }],



      //   //new query key off deployedDomainIds
      //   "deployedDomainIds": '["1","2"]',

      //   //loop and add each domain model to the deployedLocations key.
      //   //remove deployedDomainIds from return row
      //   "deployedLocations": [{
      //     "id": 1,
      //     "domain": "hardbodiesandboners.org",
      //     "activeJobs": [{
      //       "id": "",
      //       "action": "",
      //       "processing": "",
      //       "lander_id": "",
      //       "campaign_id": "",
      //       "domain_id": ""
      //     }]
      //   }]
      // }];

    }
  }

};
