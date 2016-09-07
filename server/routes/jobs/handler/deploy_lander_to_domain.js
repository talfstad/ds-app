module.exports = function(app, db) {

  var deployLanderToDomain = function(user, jobModelAttributes, callback) {

    var WorkerController = require("../../../workers")(app, db);

    var landerData = jobModelAttributes.model;
    var list = jobModelAttributes.list;
    if (landerData) {
      //update lander data to false on save here
      landerData.saveModified = false;
    } else {
      //multiple landers in this deploy
      landerData = {};
      landerData.no_optimize_on_save = true;

      //add the landerData.multipleLanders array to update multiple landers data modified = false
      landerData.multipleLanders = [];
      _.each(list, function(job) {
        landerData.multipleLanders.push(job.lander_id);
      });

    }


    var activeCampaignModelAttributes = jobModelAttributes.addActiveCampaignModel

    db.landers.updateAllLanderData(user, landerData, function(err) {
      if (err) {
        callback({ code: "InvalidLanderInputs" });
      } else {
        //if any of these jobs have the same action, domain_id and lander_id then we
        // update the current ones to error=1 and code = "ExternalInterrupt"
        db.jobs.cancelAnyCurrentRunningDuplicateJobs(user, list, function(err) {
          if (err) {
            callback(err);
          } else {
              console.log("GOT HERE: ")

            var addActiveCampaign = function(callback) {
              app.log("active campaign attr: " + JSON.stringify(activeCampaignModelAttributes), "debug");

              if (!activeCampaignModelAttributes) {
                callback(false);
              } else {

                var afterAddingActiveCampaignCallback = function(err, active_campaign_id) {
                  if (err) {
                    callback(err);
                  } else {
                    app.log("\n\ngot active domain campaign_id! : T: " + active_campaign_id, "debug");
                    callback(false, active_campaign_id);
                  }
                };

                var addActiveCampaignToLandersWithCampaigns = function(callback) {
                  db.campaigns.addActiveCampaignToLander(user, activeCampaignModelAttributes, function(err, active_campaign_id) {
                    if (err) {
                      callback(err);
                    } else {
                      callback(false, active_campaign_id);
                    }
                  });
                };

                var addActiveCampaignToCampaignsWithDomains = function(callback) {
                  db.campaigns.addActiveCampaignToDomain(user, activeCampaignModelAttributes, function(err, active_campaign_id) {
                    if (err) {
                      callback(err);
                    } else {
                      callback(false, active_campaign_id);
                    }
                  });
                };

                //add the active campaign, this means add to landers or domains based on what action we passed the model
                var activeCampaignAction = activeCampaignModelAttributes.action;
                if (activeCampaignAction == "lander") {
                  addActiveCampaignToLandersWithCampaigns(afterAddingActiveCampaignCallback);
                } else if (activeCampaignAction == "domain") {
                  console.log("ADdding active campaign to DOMAIN")
                  addActiveCampaignToCampaignsWithDomains(afterAddingActiveCampaignCallback);
                } else {
                  callback({ code: "CouldNotAddActiveCampaignNoAction" });
                }
              }
            };

            var addNewLanders = function(callback) {
              //get the jobs with .new key = true
              var finalNewLandersList = [];
              var newLanders = [];
              for (var i = 0; i < list.length; i++) {
                if (list[i].new) {
                  newLanders.push(list[i]);
                }
              }

              if (newLanders.length <= 0) {
                callback(false, []);
              } else {
                var asyncIndex = 0;
                for (var i = 0; i < newLanders.length; i++) {
                  var newLander = newLanders[i];

                  db.landers.addLanderToDeployedLanders(user, newLander, function(err, newLander) {
                    if (err) {
                      callback({ code: "CouldNotAddToDeployedLandersDb" });
                    } else {

                      newLander.deployed_row_id = newLander.id;

                      finalNewLandersList.push(newLander);
                      if (++asyncIndex == newLanders.length) {
                        callback(false, finalNewLandersList);
                      }
                    }
                  });
                }
              }
            };

            addActiveCampaign(function(err, active_campaign_id) {
              if (err) {
                callback(err);
              } else {

                //get the list and 
                addNewLanders(function(err, newLanders) {
                  if (err) {                    
                    callback(err);
                  } else {

                    //if not modified then we arent redeploying, so just deploy the NEW lander that was added
                    // ## TODO put this on the front end for landers
                    // if (!landerData.modified && newLanders.length > 0) {
                    //   list = newLanders;
                    // }

                    //if list is empty just save the lander
                    if (list.length > 0) {
                      //register first job and assign as master
                      var firstJobAttributes = list.shift();
                      var finalList = [];


                      db.jobs.registerJob(user, firstJobAttributes, function(err, registeredMasterJobAttributes) {

                        //start the first job (master job)
                        registeredMasterJobAttributes.active_campaign_id = active_campaign_id;

                        WorkerController.startJob(registeredMasterJobAttributes.action, user, registeredMasterJobAttributes);

                        finalList.push(registeredMasterJobAttributes);
                        var masterJobId = registeredMasterJobAttributes.id;

                        //call register job in for loop with async index
                        if (list.length > 0) {
                          var asyncIndex = 0;
                          for (var i = 0; i < list.length; i++) {

                            list[i].master_job_id = masterJobId;

                            db.jobs.registerJob(user, list[i], function(err, registeredSlaveJobAttributes) {

                              finalList.push(registeredSlaveJobAttributes);

                              //start slave job
                              WorkerController.startJob(registeredSlaveJobAttributes.action, user, registeredSlaveJobAttributes);

                              if (++asyncIndex == list.length) {
                                callback(false, finalList);
                              }
                            });
                          }
                        } else {
                          callback(false, finalList);
                        }
                      });
                    } else {

                      if (!landerData.no_optimize_on_save) {
                        //action: saveLander
                        var saveLanderJobAttributes = {
                          lander_id: landerData.id,
                          action: "savingLander",
                          deploy_status: "saving",
                          active_campaign_id: active_campaign_id
                        };

                        db.jobs.registerJob(user, saveLanderJobAttributes, function(err, registeredJobAttributes) {
                          callback(false, [registeredJobAttributes]);
                          WorkerController.startJob(registeredJobAttributes.action, user, { job: registeredJobAttributes, lander: landerData });
                        });

                      } else {
                        //just a light save, no optimization needed. no job added to optimize
                        callback(false, [{ active_campaign_id: active_campaign_id }]);
                      }
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
  };

  return deployLanderToDomain;
};
