module.exports = function(app, passport) {
  var module = {};

  var db = require("../db_api");
  var WorkerController = require("../workers")(app, db);

  //start a new job
  app.post('/api/jobs', passport.isAuthenticated(), function(req, res) {
    var user = req.user;

    var jobModelAttributes = req.body;

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

    //special logic for add lander
    if (jobModelAttributes.action === "addNewLander") {
      jobModelAttributes.landerFile = req.files['landerFile'];

      //need to save the lander first since its new to get an id before triggering register job
      db.landers.saveNewLander(user, jobModelAttributes.landerName, function(err, landerAttributes) {
        if (err) {

        } else {
          jobModelAttributes.lander_id = landerAttributes.id;
          jobModelAttributes.created_on = landerAttributes.created_on;
          db.jobs.registerJob(user, jobModelAttributes, afterRegisterJob, registerError)
        }

      });

    } else if (jobModelAttributes.action === "ripNewLander") {
      //need to save the lander first since its new to get an id before triggering register job
      db.landers.saveNewLander(user, jobModelAttributes.lander_name, function(err, landerAttributes) {
        if (err) {
          res.json({
            err: err
          });
        } else {
          jobModelAttributes.lander_id = landerAttributes.id;
          jobModelAttributes.created_on = landerAttributes.created_on;
          db.jobs.registerJob(user, jobModelAttributes, afterRegisterJob, registerError)
        }

      });
    } else if (jobModelAttributes.action === "redeploy") {

      //get the list and 
      var list = jobModelAttributes.list;
      //register first job and assign as master
      var firstJobAttributes = list.shift();


      db.jobs.registerJob(user, firstJobAttributes, function(registeredMasterJobAttributes) {
        //start the first job (master job)
        WorkerController.startJob(registeredMasterJobAttributes.action, user, registeredMasterJobAttributes);

        firstJobAttributes.id = registeredMasterJobAttributes.id;
        var masterJobId = firstJobAttributes.id;

        //call register job in for loop with async index
        var asyncIndex = 0;
        for (var i = 0; i < list.length; i++) {

          list[i].master_job_id = masterJobId;

          db.jobs.registerJob(user, list[i], function(registeredSlaveJobAttributes) {

            list[asyncIndex].id = registeredSlaveJobAttributes.id;

            //start slave job
            WorkerController.startJob(registeredSlaveJobAttributes.action, user, registeredSlaveJobAttributes);

            if (++asyncIndex == list.length) {
              //done, send response
              //put first job back on there with its id
              var attr = {
                modified: false,
                id: registeredSlaveJobAttributes.lander_id
              };
              
              console.log("attr22: " + JSON.stringify(attr));

              db.landers.updateLanderModifiedData(user, attr, function(err) {
                list.unshift(firstJobAttributes);
                res.json(list);
              });
            }
          });
        }

        //if only 1 item return
        if (list.length <= 0) {
          list.unshift(firstJobAttributes);
          res.json(list);
        }
      });


    } else if (jobModelAttributes.action == "deployLanderToDomain") {
      db.landers.addLanderToDeployedLanders(user, jobModelAttributes.lander_id, jobModelAttributes.domain_id, function(err, deployedDomainId) {
        if (err) {
          res.json({ code: "CouldNotAddToDeployedLandersDb" });
        } else {
          var afterRegisterDeploy = function(registeredJobAttributes) {
            //send response
            registeredJobAttributes.deployed_domain_id = deployedDomainId;
            res.json(registeredJobAttributes);

            WorkerController.startJob(registeredJobAttributes.action, user, registeredJobAttributes);
          };
          db.jobs.registerJob(user, jobModelAttributes, afterRegisterDeploy)
        }
      });

    } else {
      //TODO: validate job model is valid to begin
      db.jobs.registerJob(user, jobModelAttributes, afterRegisterJob)

    }






  });

  return module;

}
