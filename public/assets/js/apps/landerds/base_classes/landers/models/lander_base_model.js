define(["app",
    "assets/js/jobs/jobs_base_gui_model",
    "assets/js/apps/landerds/domains/dao/domain_collection",
    "assets/js/apps/landerds/landers/dao/url_endpoint_collection",
    "assets/js/apps/landerds/landers/dao/deployed_domain_collection",
    "assets/js/apps/landerds/landers/dao/active_campaign_collection"
  ],
  function(Landerds, JobsGuiBaseModel, DomainCollection, UrlEndpointCollection,
    DeployedDomainsCollection, ActiveCampaignCollection) {
    var LanderModel = JobsGuiBaseModel.extend({
      
    
      initialize: function() {
        JobsGuiBaseModel.prototype.initialize.apply(this);

        var me = this;

        this.set("originalValueOptimized", this.get("optimized"));
        this.set("originalValueDeploymentFolderName", this.get("deployment_folder_name"));
        this.set("originalValueDeployRoot", this.get("deploy_root"));
        this.set("originalActiveSnippets", this.get("activeSnippets"));


        var deployedDomainAttributes = this.get("deployedDomains");
        var deployedDomainsCollection = new DeployedDomainsCollection(deployedDomainAttributes);
        

        var urlEndpointAttributes = this.get("urlEndpoints");
        deployedDomainsCollection.urlEndpoints = urlEndpointAttributes;
        deployedDomainsCollection.landerName = this.get("name");
      

        this.set("deployedDomains", deployedDomainsCollection);


        var urlEndpointCollection = new UrlEndpointCollection(urlEndpointAttributes);
      

        this.set("urlEndpoints", urlEndpointCollection);

        
        var activeCampaignAttributes = this.get("activeCampaigns");
        var activeCampaignCollection = new ActiveCampaignCollection();
        this.set("activeCampaigns", activeCampaignCollection);
        activeCampaignCollection.add(activeCampaignAttributes);

      }

    });
    return LanderModel;
  });
