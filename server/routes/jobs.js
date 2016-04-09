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
    } else {

      //TODO: validate job model is valid to begin
      db.jobs.registerJob(user, jobModelAttributes, afterRegisterJob, registerError)

    }






  });

  return module;

}
