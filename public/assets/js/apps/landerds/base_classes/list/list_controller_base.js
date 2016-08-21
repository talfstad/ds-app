define(["app",
    "assets/js/common/notification",
    "assets/js/jobs/jobs_model",
    "assets/js/apps/landerds/landers/dao/deployed_domain_model"
  ],
  function(Landerds, Notification, JobModel, DeployedDomainModel) {

    var BaseListController = {

      filteredCollection: null,

      BaseClassInitialize: function() {
        //reinit the updater
        Landerds.updater.initialize();
      },

      updateTopbarTotals: function() {
        if (this.filteredCollection) {
          this.filteredCollection.updateTotals();
        }
      },

      //add the lander model to the list
      addRow: function(model) {
        Landerds.trigger('landers:closesidebar');
        Landerds.trigger('campaigns:closesidebar');
        Landerds.trigger('domains:closesidebar');

        this.filteredCollection.add(model);
        //1. goto page with new lander on it
        this.expandAndShowRow(model);
      },

      expandAndShowRow: function(model) {
        if (this.filteredCollection) {
          //1. show the page with this model
          this.filteredCollection.showPageWithModel(model);
          //2. expand new lander row item
          model.trigger("view:expand");
        }
      },

      undeployLanderFromDomains: function(undeployAttr) {
        var me = this;

        var landerModel = undeployAttr.landerModel;
        var undeployDomainIdsArr = undeployAttr.undeployDomainIdsArr;

        var lander_id = landerModel.get("id");

        var deployedDomainCollection = landerModel.get("deployedDomains");
        var deployedDomainsJobList = [];

        //find domain in deployed domains and create undeploy job for it
        $.each(undeployDomainIdsArr, function(idx, domainToUndeployId) {

          deployedDomainCollection.each(function(deployedDomain) {

            if (domainToUndeployId == deployedDomain.get("domain_id")) {
              deployedDomainsJobList.push({
                lander_id: lander_id,
                domain_id: domainToUndeployId,
                action: "undeployLanderFromDomain",
                deploy_status: "undeploying"
              });
            }
          });
        });

        var undeployJobModel = new JobModel({
          action: "undeployLanderFromDomain",
          list: deployedDomainsJobList,
          model: landerModel,
          neverAddToUpdater: true
        });

        var undeployJobAttributes = {
          jobModel: undeployJobModel,
          onSuccess: function(responseJobList) {

            //create job models for each deployed domain and add them!
            deployedDomainCollection.each(function(deployedDomainModel) {
              $.each(responseJobList, function(idx, responseJobAttr) {

                if (deployedDomainModel.get("domain_id") == responseJobAttr.domain_id) {
                  //create new individual job model for
                  var activeJobs = deployedDomainModel.get("activeJobs");
                  var newUndeployJob = new JobModel(responseJobAttr);

                  //remove active any deploy jobs for this deployed domain
                  activeJobs.each(function(job) {
                    if (job.get("action") == "deployLanderToDomain") {
                      //remove from updater and destroy job
                      Landerds.updater.remove(this);
                      delete job.attributes.id;
                      job.destroy();
                    }
                  });
                  activeJobs.add(newUndeployJob);
                  //call start for each job 
                  Landerds.trigger("job:start", newUndeployJob);
                }
              });
            });
          }
        };

        Landerds.trigger("job:start", undeployJobAttributes);

      },

      //handles add campaigns deploy as well so must take empty list
      //needs to be able to take empty list, or more
      baseClassDeployLandersToDomain: function(attr) {
        var me = this;

        var landerModel = attr.landerModel;
        var domainListToDeploy = attr.domainListToDeploy;

        var masterDomain = domainListToDeploy[0];

        if (!masterDomain.noDomainsToAdd) {

          //create a list of deployed domain models to create for redeploy
          var deployedDomains = landerModel.get("deployedDomains");
          $.each(domainListToDeploy, function(idx, domainToDeployAttributes) {

            var isDeployed = false;
            deployedDomains.each(function(deployedDomain) {
              if (deployedDomain.get("domain_id") == domainToDeployAttributes.domain_id) {
                isDeployed = true;
              }
            });

            if (!isDeployed) {

              var deployedDomainModel = new DeployedDomainModel(domainToDeployAttributes);
              deployedDomains.add(deployedDomainModel);
              //set to deploying to start
              deployedDomainModel.set("deploy_status", "deploying");

            }

          });
        }
      },

      //add un added landers (with new key), and redeploy if modified
      baseClassRedeployLanders: function(landerModel, callback) {
        var addActiveCampaignModel = false;

        //get list of all deployedDomains first
        var deployedDomainsJobList = [];
        var deployedDomainCollection = landerModel.get("deployedDomains");

        //figure out if we need to add the active campaign if it doesn't have an ID yet
        var activeCampaignsCollection = landerModel.get("activeCampaigns");
        activeCampaignsCollection.each(function(activeCampaign) {
          if (!activeCampaign.get("id")) {
            addActiveCampaignModel = activeCampaign;
          }
        });

        //get list of all locations to 
        deployedDomainCollection.each(function(deployedDomain) {
          //check if deployedDomain is undeploying. if it is ignore it!
          var isUndeploying = false;
          var activeJobs = deployedDomain.get("activeJobs");
          activeJobs.each(function(job) {
            if (job.get('action') == "undeployLanderFromDomain") {
              isUndeploying = true;
            }
          });

          //if activecampaignmodel and modified we want all of them 
          //-- this handles case where we are undeploying a domain but then add a campaign to it with that domain
          //if no active campaign model just this normal
          var addDeployedDomain = false;
          if (landerModel.get("modified")) {

            if (addActiveCampaignModel) {
              var isInCampaign = false;

              var domains = activeCampaignModel.get("domains");
              $.each(domains, function(idx, domain) {
                if (domain.domain_id == deployedDomain.get("domain_id")) {
                  isInCampaign = true;
                }
              });

              //dont add it if its undeploying and NOT in the campaign
              if (isUndeploying && !isInCampaign) {
                addDeployedDomain = false;
              } else {
                addDeployedDomain = true;
              }
            } else if (!isUndeploying) {

              addDeployedDomain = true;

            }

          } else {

            //if not modified and no addActiveCampaign model we just want to add
            //the NEW deployed domains
            if (!addActiveCampaignModel) {
              if(!deployedDomain.get("id")) {
                addDeployedDomain = true;
              }
            }
          }

          if (addDeployedDomain) {
            var isNew = false;
            if (!deployedDomain.get("id")) {
              isNew = true;
            }

            deployedDomainsJobList.push({
              lander_id: deployedDomain.get("lander_id"),
              domain_id: deployedDomain.get("domain_id"),
              action: "deployLanderToDomain",
              deploy_status: "deploying",
              new: isNew
            });
          }
        });

        //NOTE: if deployedDomainsJobList is empty it means we're
        //  . saving the lander! not deploying it (if there is no addActiveCampaignModel)

        //if modified we're going to be saving so set saving = true
        //  . this gets set false when the job updateStatus is correct
        if (landerModel.get("modified")) {

          landerModel.set({
            saving_lander: true
          });

        } else {
          //if not modified then this is a light save, or add of active campaign (to domain/lander)
          //only deploy the new domains from the active campaign
          if (addActiveCampaignModel) {
            var deployedDomainsOnActiveCampaign = [];
            var domains = addActiveCampaignModel.get("domains");

            //if deployed domain has no id and belongs to this campaign we deploy it !
            //if deployed domain is not in the campaign collection dont deploy it
            deployedDomainCollection.each(function(deployedDomain) {
              var domainDeployed = false;
              if (domains.length > 0) {

                var deployedDomainInCampaign = false;

                $.each(domains, function(idx, domain) {
                  if (deployedDomain.get("domain_id") == domain.domain_id &&
                    deployedDomain.get("id") &&
                    deployedDomain.get("deploy_status") != "undeploying" &&
                    deployedDomain.get("deploy_status") != "undeploy_invalidating") {

                    domainDeployed = true;

                  }

                  if (deployedDomain.get("domain_id") == domain.domain_id) {
                    //also dont deploy it if domain 
                    deployedDomainInCampaign = true;
                  }
                });
              } else {
                domainDeployed = true;
              }

              if (!domainDeployed && deployedDomainInCampaign) {
                deployedDomainsOnActiveCampaign.push({
                  lander_id: deployedDomain.get("lander_id"),
                  domain_id: deployedDomain.get("domain_id"),
                  action: "deployLanderToDomain",
                  deploy_status: "deploying",
                  new: true
                });
              }
            });

            deployedDomainsJobList = deployedDomainsOnActiveCampaign;
          }

        }

        var redeployJobModel = new JobModel({
          action: "deployLanderToDomain",
          list: deployedDomainsJobList,
          model: landerModel,
          addActiveCampaignModel: addActiveCampaignModel,
          neverAddToUpdater: true
        });

        var redeployJobAttributes = {
          jobModel: redeployJobModel,
          onSuccess: callback
        };

        Landerds.trigger("job:start", redeployJobAttributes);

      }
    };

    return BaseListController;
  });
