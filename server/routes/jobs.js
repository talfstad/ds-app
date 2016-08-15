module.exports = function(app, passport) {
  var module = {};

  var db = require("../db_api")(app);
  var WorkerController = require("../workers")(app, db);

  //start a new job
  app.post('/api/jobs', passport.isAuthenticated(), function(req, res) {
    var user = req.user;

    var jobModelAttributes = req.body;
    var landerModelAttributes = jobModelAttributes.model;
    var landerData = landerModelAttributes;
    var list = jobModelAttributes.list;

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

      db.landers.updateAllLanderData(user, landerModelAttributes, function(err, returnModelAttributes) {
        if (err) {
          res.json({ code: "InvalidLanderInputs" });
        } else {
          //if any of these jobs have the same action, domain_id and lander_id then we
          // update the current ones to error=1 and code = "ExternalInterrupt"
          db.jobs.cancelAnyCurrentRunningDuplicateJobs(user, list, function(err) {
            if (err) {
              res.json(err);
            } else {

              var addNewLanders = function(callback) {
                //get the jobs with .new key = true
                var newLanders = [];
                for (var i = 0; i < list.length; i++) {
                  if (list[i].new) {
                    newLanders.push(list[i]);
                  }
                }

                if (newLanders.length <= 0) {
                  callback(false);
                } else {
                  var asyncIndex = 0;
                  for (var i = 0; i < newLanders.length; i++) {
                    var newLander = newLanders[i];

                    console.log("adding a lander: " + JSON.stringify(newLander));

                    db.landers.addLanderToDeployedLanders(user, newLander, function(err, newLanderId) {
                      if (err) {
                        res.json({ code: "CouldNotAddToDeployedLandersDb" });
                      } else {
                        // newLander.id = newLander; //added by addLanderToDeployedLanders
                        if (++asyncIndex == newLanders.length) {
                          callback(false);
                        }
                      }
                    });
                  }
                }
              };

              //get the list and 
              addNewLanders(function(err) {
                if (err) {
                  res.json(err);
                } else {
                  //register first job and assign as master
                  var firstJobAttributes = list.shift();

                  db.jobs.registerJob(user, firstJobAttributes, function(registeredMasterJobAttributes) {
                    //start the first job (master job)
                    registeredMasterJobAttributes.landerData = landerData;

                    WorkerController.startJob(registeredMasterJobAttributes.action, user, registeredMasterJobAttributes);

                    firstJobAttributes.id = registeredMasterJobAttributes.id;
                    var masterJobId = firstJobAttributes.id;

                    //call register job in for loop with async index
                    var asyncIndex = 0;
                    for (var i = 0; i < list.length; i++) {

                      list[i].master_job_id = masterJobId;

                      db.jobs.registerJob(user, list[i], function(registeredSlaveJobAttributes) {

                        list[asyncIndex].id = registeredSlaveJobAttributes.id;

                        registeredSlaveJobAttributes.landerData = landerData;

                        //start slave job
                        WorkerController.startJob(registeredSlaveJobAttributes.action, user, registeredSlaveJobAttributes);

                        if (++asyncIndex == list.length) {
                          //done, send response
                          //put first job back on there with its id
                          var attr = {
                            modified: false,
                            id: registeredSlaveJobAttributes.lander_id
                          };

                          //put first job attributes back on list without modifying the list
                          res.json([firstJobAttributes].concat(list));
                        }
                      });
                    }

                    //if only 1 item return
                    if (list.length <= 0) {
                      list.unshift(firstJobAttributes);
                      res.json(list);
                    }

                  });

                }
              });
            }
          });
        }
      });



    } else {
      //TODO: validate job model is valid to begin
      db.jobs.registerJob(user, jobModelAttributes, afterRegisterJob)

    }



  });

  return module;

}
