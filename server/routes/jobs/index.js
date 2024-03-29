module.exports = function(app, passport, dbApi, controller) {
  var module = {};

  var handler = require('./handler')(app, dbApi, controller);

  //start a new job
  app.post('/api/jobs', passport.isAuthenticated(), function(req, res) {
    var user = req.user;

    var jobModelAttributes = req.body;

    //validate job domain_id and lander_id
    handler.validate.allJobs(user, jobModelAttributes, function(err) {
      if (err) {
        res.json(err);
      } else {

        //trigger handler based on action
        try {
          var action = jobModelAttributes.action;

          app.log("register and starting job action: " + action, "debug");

          if (action == "addLander") {
            jobModelAttributes.files = req.files;
          }

          handler[action](user, jobModelAttributes, function(err, returnData) {
            if (err) {
              res.json(err);
            } else {
              if (!returnData) returnData = {};
              res.json(returnData);
            }
          });

        } catch (e) {
          app.log("ERROR no handler for this job action" + e, "debug");
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
