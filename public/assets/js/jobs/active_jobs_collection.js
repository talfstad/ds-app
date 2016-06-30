define(["app",
    "assets/js/jobs/jobs_model"
  ],
  function(Landerds, JobsModel) {

    var ActiveJobsCollection = Backbone.Collection.extend({
      model: JobsModel,
    });


    return ActiveJobsCollection;
  });
