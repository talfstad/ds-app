module.exports = function(app, passport) {
  var module = {};

  var db = require("../db_api")(app);
  var WorkerController = require("../workers")(app, db);

  //start a new job
  app.post('/api/jobs', passport.isAuthenticated(), function(req, res) {
    var user = req.user;

    var jobModelAttributes = req.body;

    var landerData = jobModelAttributes.model;

    //update lander data to false on save here
    landerData.saveModified = false;

    var list = jobModelAttributes.list;
    var activeCampaignModelAttributes = jobModelAttributes.addActiveCampaignModel

    var afterRegisterJob = function(registeredJobAttributes) {
      if (registeredJobAttributes.action === "addNewLander") {
        //remove the stuff we dont want
        delete registeredJobAttributes.landerFile;
        delete registeredJobAttributes.file_id;
      }
      //send response
      res.json(registeredJobAttributes);

      WorkerController.startJob(registeredJobAttributes.action, user, registeredJobAttributes);
    };

    var registerError = function() {};


    if (jobModelAttributes.action === "deployLanderToDomain") {

      db.landers.updateAllLanderData(user, landerData, function(err, returnModelAttributes) {
        if (err) {
          res.json({ code: "InvalidLanderInputs" });
        } else {
          //if any of these jobs have the same action, domain_id and lander_id then we
          // update the current ones to error=1 and code = "ExternalInterrupt"
          db.jobs.cancelAnyCurrentRunningDuplicateJobs(user, list, function(err) {
            if (err) {
              res.json(err);
            } else {
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
                        finalNewLandersList.push(newLander);
                        // newLander.id = newLander; //added by addLanderToDeployedLanders
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
                  res.json(err);
                } else {

                  //get the list and 
                  addNewLanders(function(err, newLanders) {
                    if (err) {
                      res.json(err);
                    } else {
                      //if not modified then we arent redeploying, so just deploy the NEW lander that was added
                      if (!landerData.modified && newLanders.length > 0) {
                        list = newLanders;
                      }

                      //if list is empty just save the lander
                      if (list.length > 0) {
                        //register first job and assign as master
                        var firstJobAttributes = list.shift();
                        var finalList = [];


                        db.jobs.registerJob(user, firstJobAttributes, function(registeredMasterJobAttributes) {

                          //start the first job (master job)
                          registeredMasterJobAttributes.landerData = landerData;
                          registeredMasterJobAttributes.active_campaign_id = active_campaign_id;

                          WorkerController.startJob(registeredMasterJobAttributes.action, user, registeredMasterJobAttributes);

                          finalList.push(registeredMasterJobAttributes);
                          var masterJobId = registeredMasterJobAttributes.id;

                          //call register job in for loop with async index
                          if (list.length > 0) {
                            var asyncIndex = 0;
                            for (var i = 0; i < list.length; i++) {

                              list[i].master_job_id = masterJobId;

                              db.jobs.registerJob(user, list[i], function(registeredSlaveJobAttributes) {

                                registeredSlaveJobAttributes.landerData = landerData;
                                finalList.push(registeredSlaveJobAttributes);

                                //start slave job
                                WorkerController.startJob(registeredSlaveJobAttributes.action, user, registeredSlaveJobAttributes);

                                if (++asyncIndex == list.length) {

                                  //put first job attributes back on list without modifying the list
                                  for (var j = 0; j < finalList.length; j++) {
                                    //no need for landerData to be on the job updater...
                                    delete finalList[j].landerData;
                                  }
                                  res.json(finalList);
                                }
                              });
                            }
                          } else {
                            for (var j = 0; j < finalList.length; j++) {
                              delete finalList[j].landerData;
                            }
                            res.json(finalList);
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

                          db.jobs.registerJob(user, saveLanderJobAttributes, function(registeredJobAttributes) {
                            res.json([registeredJobAttributes]);
                            WorkerController.startJob(registeredJobAttributes.action, user, { job: registeredJobAttributes, lander: landerData });
                          });

                        } else {
                          //just a light save, no optimization needed. no job added to optimize
                          res.json([{ active_campaign_id: active_campaign_id }]);
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



    } else if (jobModelAttributes.action === "undeployLanderFromDomain") {



      //if any of these jobs have the same action or deployLanderToDomain, domain_id and lander_id then we
      // update the current ones to error=1 and code = "ExternalInterrupt"
      db.jobs.cancelAnyCurrentRunningDuplicateJobs(user, list, function(err) {
        if (err) {
          res.json(err);
        } else {

          //register first job and assign as master
          var firstJobAttributes = list.shift();
          var finalList = [];

          db.jobs.registerJob(user, firstJobAttributes, function(registeredMasterJobAttributes) {
            //start the first job (master job)
            registeredMasterJobAttributes.landerData = landerData;

            WorkerController.startJob(registeredMasterJobAttributes.action, user, { job: registeredMasterJobAttributes, lander: landerData });

            finalList.push(registeredMasterJobAttributes);
            var masterJobId = registeredMasterJobAttributes.id;

            //call register job in for loop with async index
            if (list.length > 0) {
              var asyncIndex = 0;
              for (var i = 0; i < list.length; i++) {

                list[i].master_job_id = masterJobId;

                db.jobs.registerJob(user, list[i], function(registeredSlaveJobAttributes) {

                  registeredSlaveJobAttributes.landerData = landerData;
                  finalList.push(registeredSlaveJobAttributes);

                  //start slave job
                  WorkerController.startJob(registeredSlaveJobAttributes.action, user, { job: registeredSlaveJobAttributes, lander: landerData });

                  if (++asyncIndex == list.length) {
                    //put first job attributes back on list without modifying the list
                    for (var j = 0; j < finalList.length; j++) {
                      //no need for landerData to be on the job updater...
                      delete finalList[j].landerData;
                    }
                    res.json(finalList);
                  }
                });
              }
            } else {
              for (var j = 0; j < finalList.length; j++) {
                delete finalList[j].landerData;
              }
              res.json(finalList);
            }
          });
        }
      });

    } else {
      db.jobs.registerJob(user, jobModelAttributes, afterRegisterJob)
    }

  });

  return module;

}
