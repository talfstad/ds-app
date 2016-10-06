module.exports = function(app, passport) {
  var module = {};

  var db = require("../db_api")(app);
  var WorkerController = require("../workers")(app, db);

  //start a new job
  app.post('/api/jobs', passport.isAuthenticated(), function(req, res) {
    var user = req.user;

    var jobModelAttributes = req.body;

    var landerData = jobModelAttributes.model;


    //validate job domain_id and lander_id
    if (!jobModelAttributes.domain_id || !jobModelAttributes.lander_id) {
      res.json({ error: { code: "InvalidJob" } });
    } else {

      //update lander data to false on save here
      landerData.saveModified = false;

      var list = jobModelAttributes.list;
      var activeGroupModelAttributes = jobModelAttributes.addActiveGroupModel



      if (jobModelAttributes.action === "deployLanderToDomain") {

        db.landers.updateAllLanderData(user, landerData, function(err, returnModelAttributes) {
          if (err) {
            res.json({error: { code: "InvalidLanderInputs" }});
          } else {
            //if any of these jobs have the same action, domain_id and lander_id then we
            // update the current ones to error=1 and code = "ExternalInterrupt"
            db.jobs.cancelAnyCurrentRunningDuplicateJobs(user, list, function(err) {
              if (err) {
                res.json(err);
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
                      db.groups.addActiveGroupToLander(user, activeGroupModelAttributes, function(err, active_group_id) {
                        if (err) {
                          callback(err);
                        } else {
                          callback(false, active_group_id);
                        }
                      });
                    };

                    var addActiveGroupToGroupsWithDomains = function(callback) {
                      db.groups.addActiveGroupToDomain(user, activeGroupModelAttributes, function(err, active_group_id) {
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

                addActiveGroup(function(err, active_group_id) {
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

                          db.jobs.registerJob(user, firstJobAttributes, function(err, registeredMasterJobAttributes) {

                            //start the first job (master job)
                            registeredMasterJobAttributes.landerData = landerData;
                            registeredMasterJobAttributes.active_group_id = active_group_id;

                            WorkerController.startJob(registeredMasterJobAttributes.action, user, registeredMasterJobAttributes);

                            finalList.push(registeredMasterJobAttributes);
                            var masterJobId = registeredMasterJobAttributes.id;

                            //call register job in for loop with async index
                            if (list.length > 0) {
                              var asyncIndex = 0;
                              for (var i = 0; i < list.length; i++) {

                                list[i].master_job_id = masterJobId;

                                db.jobs.registerJob(user, list[i], function(err, registeredSlaveJobAttributes) {

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
                              active_group_id: active_group_id
                            };

                            db.jobs.registerJob(user, saveLanderJobAttributes, function(err, registeredJobAttributes) {
                              res.json([registeredJobAttributes]);
                              WorkerController.startJob(registeredJobAttributes.action, user, { job: registeredJobAttributes, lander: landerData });
                            });

                          } else {
                            //just a light save, no optimization needed. no job added to optimize
                            res.json([{ active_group_id: active_group_id }]);
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

            db.jobs.registerJob(user, firstJobAttributes, function(err, registeredMasterJobAttributes) {
              //start the first job (master job)

              WorkerController.startJob(registeredMasterJobAttributes.action, user, { job: registeredMasterJobAttributes });

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
                    WorkerController.startJob(registeredSlaveJobAttributes.action, user, { job: registeredSlaveJobAttributes });

                    if (++asyncIndex == list.length) {
                      res.json(finalList);
                    }
                  });
                }
              } else {
                res.json(finalList);
              }
            });
          }
        });

      } else {

        db.jobs.registerJob(user, jobModelAttributes, function(err, registeredJobAttributes) {
          if (registeredJobAttributes.action === "addNewLander") {
            //remove the stuff we dont want
            delete registeredJobAttributes.landerFile;
            delete registeredJobAttributes.file_id;
          }
          //send response
          res.json(registeredJobAttributes);

          WorkerController.startJob(registeredJobAttributes.action, user, registeredJobAttributes);
        });
      }

    }

  });

  return module;

}
