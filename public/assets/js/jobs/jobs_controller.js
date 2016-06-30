define(["app",
    "moment"
  ],
  function(Landerds, moment) {
    Landerds.module("JobsApp", function(JobsApp, Landerds, Backbone, Marionette, $, _) {

      JobsApp.Controller = {

        // on finished state add next job
        // figure out which job is next and start it
        startNextJob: function(jobCollection) {
          var hasNextJob = false;

          var earliestJobInList = jobCollection.models[0];
          jobCollection.each(function(job) {
            var currentEarliestJobMillis = moment(earliestJobInList.get("created_on")).unix();
            var jobMillis = moment(job.get("created_on")).unix();

            if (currentEarliestJobMillis - jobMillis > 0) {
              //this job is earlier so do it
              earliestJobInList = job;
            }
          });

          if (earliestJobInList) {
            this.startJob(earliestJobInList);
          }

        },

        //register the job when its created and put it on the updater IF no jobs are already
        // on the updater that block it
        startJob: function(jobModel, newJobAddedCallback) {

          var addToUpdater = function(model) {
            Landerds.updater.add(model || jobModel);
          }

          //register it
          if (!jobModel.get("processing") && !jobModel.get("id")) {
            //registers the job and starts it on server (if no other jobs are blocking it)
            jobModel.save({}, {
              success: function(model, response) {
                //post register job callback
                var onAfterRegister = jobModel.get("onAfterRegister");
                if (onAfterRegister) {
                  onAfterRegister();
                }

                if (!jobModel.get("neverAddToUpdater")) {
                  addToUpdater(model, response);
                }

                if (newJobAddedCallback) {
                  newJobAddedCallback(response);
                }
              }
            });
          } else {
            addToUpdater();
          }

        }

      }
    });

    return Landerds.JobsApp.Controller;
  });
