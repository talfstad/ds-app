define(["app",
    "/assets/js/apps/moonlander/domains/undeploy_campaign/views/undeploy_layout_view.js",
    "/assets/js/jobs/jobs_model.js"
  ],
  function(Moonlander, UndeployLayoutView, JobModel) {
    Moonlander.module("DomainsApp.Domains.UndeployCampaign", function(UndeployCampaign, Moonlander, Backbone, Marionette, $, _) {

      UndeployCampaign.Controller = {

        showUndeployDomainFromCampaignDialog: function(attr) {
          var activeCampaignModel = attr.campaign_model;
          var domainModel = attr.domain_model;
          var campaign_id = activeCampaignModel.get("campaign_id");

          var removeDomainFromCampaignLayout = new UndeployLayoutView({
            campaign_model: activeCampaignModel,
            domain_model: domainModel
          });

          removeDomainFromCampaignLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(removeDomainFromCampaignLayout);

          //on add save the camp to db
          removeDomainFromCampaignLayout.on("removeCampaignFromDomain", function() {

            var activeCampaignModelActiveJobs = activeCampaignModel.get("activeJobs");

            var deployedLandersCollection = domainModel.get("deployedLanders");

            $.each(activeCampaignModel.get("deployedLanders"), function(idx, deployedLanderAttr) {

              deployedLandersCollection.each(function(deployedLanderModel) {
                var deployedLanderModelActiveJobs = deployedLanderModel.get("activeJobs");
                
                //find the deployed landers that belong to this campaign
                campaignLanderId = deployedLanderAttr.lander_id || deployedLanderAttr.id;
                deployedLanderModelId = deployedLanderModel.get("lander_id") || deployedLanderModel.get("id")
                if (campaignLanderId == deployedLanderModelId) {

                  //create undeploy job for domain and add it to the domain and the lander model
                  var jobAttributes = {
                    action: "undeployLanderFromDomain",
                    lander_id: deployedLanderModel.get("lander_id") || deployedLanderModel.get("id"),
                    domain_id: domainModel.get("domain_id") || domainModel.get("id"),
                    campaign_id: campaign_id
                  };

                  var jobModel = new JobModel(jobAttributes);

                  deployedLanderModelActiveJobs.add(jobModel);
                  activeCampaignModelActiveJobs.add(jobModel);

                  Moonlander.trigger("job:start", jobModel);

                }

              });

            });


            //no landers on campaign so nothing needs to be undeployed. just destroy it
            if (activeCampaignModel.get("deployedLanders").length <= 0) {
              activeCampaignModel.destroy();
            }
          });
        }
      }
    });

    return Moonlander.DomainsApp.Domains.UndeployCampaign.Controller;
  });
