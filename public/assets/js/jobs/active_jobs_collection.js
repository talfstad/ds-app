define(["app",
    "assets/js/jobs/jobs_model"
  ],
  function(Landerds, JobsModel) {

    var activeJobsCollection = Backbone.Collection.extend({
      model: JobsModel,
    });

    return activeJobsCollection;
  });
