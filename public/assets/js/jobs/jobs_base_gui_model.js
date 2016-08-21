define(["app",
    "assets/js/jobs/active_jobs_collection"
  ],
  function(Landerds, ActiveJobCollection) {
    var JobsBaseGuiModel = Backbone.Model.extend({

      initialize: function() {
        //build active jobs child collection
        var activeJobsAttributes = this.get("activeJobs");
        var activeJobCollection = new ActiveJobCollection();

        if (activeJobsAttributes) {
          activeJobCollection.add(activeJobsAttributes);
        }

        this.set("activeJobs", activeJobCollection);

      },


      //checking for active jobs
      startActiveJobs: function() {
        var me = this;
        var activeJobs = this.get("activeJobs");
        activeJobs.each(function(job) {
          Landerds.trigger("job:start", job);
        });
      }

    });
    return JobsBaseGuiModel;
  });
