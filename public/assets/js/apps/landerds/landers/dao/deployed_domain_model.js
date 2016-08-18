define(["app",
    "assets/js/apps/landerds/base_classes/deployed_rows/models/deployed_row_base_model"
  ],
  function(Landerds, DeployedRowBaseModel) {
    var deployedDomainModel = DeployedRowBaseModel.extend({

      urlRoot: '/api/deployed_domain',

      initialize: function() {
        var me = this;
        //call base class init
        DeployedRowBaseModel.prototype.initialize.apply(this);

        //when job is destroyed must look to see if there are any more
        var activeJobsCollection = this.get("activeJobs");

        activeJobsCollection.on("add remove", function() {
          me.setDeployStatus();
        });

        activeJobsCollection.on("updateJobModel", function(jobModelAttributes) {

          me.updateBaseJobModel(jobModelAttributes);

          //check for pagespeed and update them if we have them
          var pagespeedArr = jobModelAttributes.extra.pagespeed;
          if (pagespeedArr) {
            //update the endpoints pagespeed scores !
            var urlEndpointCollection = me.get("urlEndpoints");
            //update the urlEndpoints pagespeed scores

            $.each(pagespeedArr, function(idx, item) {

              //get url endpoint
              urlEndpointCollection.each(function(endpoint) {
                if (endpoint.get("filename") == item.filename) {
                  //update this endpoint's pagespeed score
                  endpoint.set({
                    original_pagespeed: item.original_pagespeed,
                    optimized_pagespeed: item.optimized_pagespeed
                  });
                }
              });
            });

            //trigger a changed_pagespeed
            me.trigger("changed_pagespeed");
          }
        });

        activeJobsCollection.on("startState", function(attr) {
          me.setBaseModelStartState(attr);
        });

        activeJobsCollection.on("finishedState", function(jobModel) {
          me.baseModelFinishState(jobModel);

          if (jobModel.get("action") === "undeployDomainFromLander" ||
            jobModel.get("action") === "undeployLanderFromDomain" ||
            jobModel.get("alternate_action") === "undeployDomainFromLander") {

            Landerds.updater.remove(jobModel);

            delete jobModel.attributes.id;
            jobModel.destroy();

            Landerds.trigger("list:removeDeployedDomainModelFromCollection", me);

          } else {
            //finished with this job so destroy the jobModel
            //hack to get it to not send DELETE XHR
            delete jobModel.attributes.id;
            jobModel.destroy();
          }

          //trigger to start the next job on the list
          Landerds.trigger("job:startNext", activeJobsCollection);
        });

        this.startActiveJobs();

      },

      defaults: {
        domain: "",
        nameservers: "",
        //gui attributes
        //should default true since deployed_domains is where this model is used
        deploy_status: 'deployed',
        hasActiveCampaigns: false,
        modified: false,
        endpoint_load_times: [],
      }


    });

    return deployedDomainModel;

  });
