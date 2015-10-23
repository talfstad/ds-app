define(["app",
    "/assets/js/apps/moonlander/landers/list/deployed/views/deployed_domain_row_view.js",
    "/assets/js/apps/moonlander/landers/list/deployed/views/deployed_domains_empty_view.js"
  ],
  function(Moonlander, DeployedDomainRowView, EmptyView) {

    Moonlander.module("LandersApp.Landers.List.Deployed", function(Deployed, Moonlander, Backbone, Marionette, $, _) {
      Deployed.ChildView = Marionette.CollectionView.extend({
        tagName: "tbody",
        childView: DeployedDomainRowView,
        emptyView: EmptyView,

        childEvents: {
          "updateParentLayout": "updateLayoutWithNewChildInfo"
        },

        updateLayoutWithNewChildInfo: function(childView){
          //only update if deploying or not_deployed
          var deployStatus = "deployed";
          this.children.each(function(deployedDomainView){
            var deployedDomainDeployStatus = deployedDomainView.model.get("deploy_status");
            if(deployedDomainDeployStatus == "not_deployed") {
              deployStatus = "not_deployed";
            }
            else if(deployedDomainDeployStatus == "deploying") {
              deployStatus = "deploying";
            }
          });

           this.trigger("updateParentLayout", deployStatus);
        },

        //pass the deployed list its rendered index for # column
        childViewOptions: function(model) {
          model.set('viewIndex', parseInt(this.collection.indexOf(model))+1);
          model.set('urlEndpoints', this.collection.urlEndpoints);
        }
        
      });
    });
    return Moonlander.LandersApp.Landers.List.Deployed.ChildView;
  });
