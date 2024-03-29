module.exports = function(app,  dbApi, Worker, controller) {

  var deployLanderToDomain = function(user, jobModelAttributes, callback) {

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


    var activeGroupModelAttributes = jobModelAttributes.addActiveGroupModel

    dbApi.landers.updateAllLanderData(user, landerData, function(err) {
      if (err) {
        callback({
          error: { code: "InvalidLanderInputs" },
          deployment_folder_name: err.deployment_folder_name,
          old_deployment_folder_name: err.deployment_folder_name
        });
      } else {
        //if any of these jobs have the same action, domain_id and lander_id then we
        // update the current ones to error=1 and code = "ExternalInterrupt"
        dbApi.jobs.cancelAnyCurrentRunningDuplicateJobs(user, list, function(err) {
          if (err) {
            callback(err);
          } else {

            var addActiveGroup = function(callback) {
              app.log("active group attr: " + JSON.stringify(activeGroupModelAttributes), "debug");

              if (!activeGroupModelAttributes) {
                callback(false);
              } else {

                var afterAddingActiveGroupCallback = function(err, active_group_id) {
                  if (err) {
                    callback(err);
                  } else {
                    app.log("\n\ngot active domain group_id! : T: " + active_group_id, "debug");
                    callback(false, active_group_id);
                  }
                };

                var addActiveGroupToLandersWithGroups = function(callback) {
                  dbApi.groups.addActiveGroupToLander(user, activeGroupModelAttributes, function(err, active_group_id) {
                    if (err) {
                      callback(err);
                    } else {
                      callback(false, active_group_id);
                    }
                  });
                };

                var addActiveGroupToGroupsWithDomains = function(callback) {
                  dbApi.groups.addActiveGroupToDomain(user, activeGroupModelAttributes, function(err, active_group_id) {
                    if (err) {
                      callback(err);
                    } else {
                      callback(false, active_group_id);
                    }
                  });
                };

                //add the active group, this means add to landers or domains based on what action we passed the model
                var activeGroupAction = activeGroupModelAttributes.action;
                if (activeGroupAction == "lander") {
                  addActiveGroupToLandersWithGroups(afterAddingActiveGroupCallback);
                } else if (activeGroupAction == "domain") {
                  app.log("Adding active group to DOMAIN", "debug")
                  addActiveGroupToGroupsWithDomains(afterAddingActiveGroupCallback);
                } else {
                  callback({ code: "CouldNotAddActiveGroupNoAction" });
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

                  dbApi.landers.addLanderToDeployedLanders(user, newLander, function(err, newLander) {
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

            addActiveGroup(function(err, active_group_id) {
              if (err) {
                callback(err);
              } else {

                //get the list and 
                addNewLanders(function(err, newLanders) {
                  if (err) {
                    callback(err);
                  } else {

                    app.log("active group id : " + active_group_id, "debug");
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


                      dbApi.jobs.registerJob(user, firstJobAttributes, function(err, registeredMasterJobAttributes) {

                        //start the first job (master job)
                        registeredMasterJobAttributes.active_group_id = active_group_id;

                        Worker.startJob(registeredMasterJobAttributes.action, user, registeredMasterJobAttributes);

                        finalList.push(registeredMasterJobAttributes);
                        var masterJobId = registeredMasterJobAttributes.id;

                        //call register job in for loop with async index
                        if (list.length > 0) {
                          var asyncIndex = 0;
                          for (var i = 0; i < list.length; i++) {

                            //if the master job id domain and lander ids are equal its a slave
                            if (registeredMasterJobAttributes.lander_id == list[i].lander_id) {
                              list[i].master_job_id = masterJobId;
                            }

                            dbApi.jobs.registerJob(user, list[i], function(err, registeredSlaveJobAttributes) {

                              finalList.push(registeredSlaveJobAttributes);

                              //start slave job
                              Worker.startJob(registeredSlaveJobAttributes.action, user, registeredSlaveJobAttributes);

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
                          active_group_id: active_group_id
                        };

                        dbApi.jobs.registerJob(user, saveLanderJobAttributes, function(err, registeredJobAttributes) {
                          callback(false, [registeredJobAttributes]);
                          Worker.startJob(registeredJobAttributes.action, user, { job: registeredJobAttributes, lander: landerData });
                        });

                      } else {
                        app.log("light save", "debug");
                        //just a light save, no optimization needed. no job added to optimize
                        if (active_group_id) {
                          callback(false, [{ active_group_id: active_group_id }]);
                        } else {
                          callback(false, []);
                        }
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
