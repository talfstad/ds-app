define(["app",
    "/assets/js/apps/moonlander/campaigns/remove_lander/views/remove_lander_layout_view.js",
    "/assets/js/jobs/jobs_model.js"
  ],
  function(Moonlander, RemoveLanderFromCampaignLayout, JobModel) {
    Moonlander.module("CampaignsApp.Campaigns.RemoveLander", function(RemoveLander, Moonlander, Backbone, Marionette, $, _) {

      RemoveLander.Controller = {

        showRemoveLander: function(attr) {
          var campaignModel = attr.campaign_model;
          var deployedLanderModel = attr.lander_model;
          var campaign_id = campaignModel.get("id");

          var removeLanderFromCampaignLayout = new RemoveLanderFromCampaignLayout({
            campaign_model: campaignModel,
            lander_model: deployedLanderModel
          });

          removeLanderFromCampaignLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(removeLanderFromCampaignLayout);

          //on add save the camp to db
          removeLanderFromCampaignLayout.on("removeLanderFromCampaignConfirm", function() {

            var deployedLanderModelActiveJobs = deployedLanderModel.get("activeJobs");

            var deployedDomainsCollection = campaignModel.get("deployedDomains");
            deployedDomainsCollection.each(function(deployedDomainModel) {

              var deployedDomainModelActiveJobs = deployedDomainModel.get("activeJobs");


              //create undeploy job for domain and add it to the domain and the lander model
              var jobAttributes = {
                action: "undeployLanderFromDomain",
                lander_id: deployedLanderModel.get("lander_id") || deployedLanderModel.get("id"),
                domain_id: deployedDomainModel.get("domain_id") || deployedDomainModel.get("id"),
                campaign_id: campaign_id
              };

              var jobModel = new JobModel(jobAttributes);

              deployedLanderModelActiveJobs.add(jobModel);

              deployedDomainModelActiveJobs.add(jobModel);

              Moonlander.trigger("job:start", jobModel);

            });
            //no domains so nothing needs to be undeployed. just destroy it
            if (deployedDomainsCollection.length <= 0) {
              deployedLanderModel.destroy();
            }



          });


        }

      }
    });

    return Moonlander.CampaignsApp.Campaigns.RemoveLander.Controller;
  });
