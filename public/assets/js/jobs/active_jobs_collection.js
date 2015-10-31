define(["app",
		"/assets/js/jobs/jobs_model.js"], 
function(Moonlander, JobsModel) {
  
  var ActiveJobsCollection = Backbone.Collection.extend({
    model: JobsModel,
  });


  return ActiveJobsCollection;
});
