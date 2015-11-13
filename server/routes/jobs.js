module.exports = function(app, db, passport) {
    var module = {};
    
    var db = require("../db_api");
    var WorkerController = require("../workers")(app, db);

    //start a new job
    app.post('/api/jobs', function(req, res) {
      var user = req.user;

      var jobModelAttributes = req.body;

      //TODO: validate job model is valid to begin

      var afterRegisterJob = function(registeredJobAttributes) {
        res.json(registeredJobAttributes);
        WorkerController.startJob(registeredJobAttributes.action, user, registeredJobAttributes);
      };

      var registerError = function(){};

      db.jobs.registerJob(user, jobModelAttributes, afterRegisterJob, registerError)


    });

    return module;

}