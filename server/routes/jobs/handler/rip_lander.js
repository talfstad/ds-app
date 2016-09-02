module.exports = function(app, db) {

  var ripLander = function(user, jobModelAttributes, callback) {

    var WorkerController = require("../../../workers")(app, db);
    var validUrl = require("valid-url");

    //validate the ripped input data
    //validate the name and url
    var name = jobModelAttributes.name;
    var url = jobModelAttributes.lander_url;

    if (validUrl.isHttpUri(url) || validUrl.isHttpsUri(url)) {

      var landerData = {
        name: name,
        lander_url: url
      };

      db.landers.saveNewLander(user, landerData, function(err) {
        if (err) {
          callback({ error: { code: "CouldNotAddLander" } });
        } else {

          jobModelAttributes.lander_id = landerData.id;
          jobModelAttributes.lander_created_on = landerData.created_on;

          //register the rip job
          db.jobs.registerJob(user, jobModelAttributes, function(err, registeredJobAttributes) {

            app.log("REGISTERED JOB: " + JSON.stringify(registeredJobAttributes), "debug");

            //start the job
            WorkerController.startJob(registeredJobAttributes.action, user, registeredJobAttributes);

            callback(false, registeredJobAttributes);
          });

        }
      });
    } else {
      callback({ error: { code: "InvalidUrl" } });
    }

  };

  return ripLander;
};
