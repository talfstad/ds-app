define(["app",
    "assets/js/apps/landerds/jobs/jobs_model"
  ],
  function(Landerds, JobsModel) {

    var activeJobsCollection = Backbone.Collection.extend({
      model: JobsModel,
    });

    return activeJobsCollection;
  });
