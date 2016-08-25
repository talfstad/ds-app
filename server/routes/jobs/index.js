module.exports = function(app, passport) {
  var module = {};

  var db = require("../../db_api")(app);
  var WorkerController = require("../../workers")(app, db);

  var handler = require('./handler')(app, db);

  //start a new job
  app.post('/api/jobs', passport.isAuthenticated(), function(req, res) {
    var user = req.user;

    var jobModelAttributes = req.body;

    //validate job domain_id and lander_id
    handler.validate.allJobs(user, jobModelAttributes, function(err) {
      if (err) {
        json.res(err);
      } else {

        //trigger handler based on action
        try {
          var action = jobModelAttributes.action;
          
          app.log("register and starting job action: " + action, "debug");

          handler[action](user, jobModelAttributes, function(err, returnData) {
            if (err) {
              res.json(err);
            } else {
              if(!returnData) returnData = {};
              res.json(returnData);
            }
          });

        } catch (e) {
          console.log("ERROR no handler for this job action" + e);
          res.json({
            error: {
              code: "NoHandlerForJob"
            }
          });
        }
      }
    });

  });

  return module;

};
