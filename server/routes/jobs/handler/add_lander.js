module.exports = function(app, dbApi, Worker, controller) {

  var addLander = function(user, jobModelAttributes, callback) {

    //validate the ripped input data
    var name = jobModelAttributes.name;

    //validation
    if (true) {

      var landerData = {
        name: name
      };

      dbApi.landers.saveNewLander(user, landerData, function(err) {
        if (err) {
          callback({ error: { code: "CouldNotAddLander" } });
        } else {

          jobModelAttributes.lander_id = landerData.id;
          jobModelAttributes.lander_created_on = landerData.created_on;

          //register the rip job
          dbApi.jobs.registerJob(user, jobModelAttributes, function(err, registeredJobAttributes) {

            app.log("REGISTERED JOB: " + JSON.stringify(registeredJobAttributes), "debug");

            //start the job
            Worker.startJob(registeredJobAttributes.action, user, registeredJobAttributes);

            callback(false, registeredJobAttributes);
          });

        }
      });

    } else {
      callback({ error: { code: "InvalidInputs" } });
    }

  };

  return addLander;
};
