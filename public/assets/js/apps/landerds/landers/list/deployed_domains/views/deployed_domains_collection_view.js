define(["app",
    "assets/js/apps/landerds/landers/list/deployed_domains/views/deployed_domain_row_view",
    "assets/js/apps/landerds/landers/list/deployed_domains/views/deployed_domains_empty_view",
    "assets/js/apps/landerds/base_classes/deployed_rows/views/deployed_rows_collection_base_view"
  ],
  function(Landerds, DeployedDomainRowView, EmptyView, DeployedRowsCollectionBaseView) {

    Landerds.module("LandersApp.Landers.List.Deployed", function(Deployed, Landerds, Backbone, Marionette, $, _) {
      Deployed.ChildView = DeployedRowsCollectionBaseView.extend({
        tagName: "tbody",
        childView: DeployedDomainRowView,
        emptyView: EmptyView,

        childEvents: {
          "getLoadTime": "getLoadTime"
        },

        onAddChild: function(childView) {
          this.reIndex();
        },

        onRemoveChild: function(childView) {
          this.reIndex();
        },

        reIndex: function() {
          this.collection.each(function(deployedDomainModel, idx) {
            deployedDomainModel.set("viewIndex", idx + 1);
          });
        },

        //pass the deployed list its rendered index for # column
        childViewOptions: function(model) {
          model.set('viewIndex', parseInt(this.collection.indexOf(model)) + 1);
          model.set('urlEndpoints', this.collection.urlEndpoints);
          model.set('landerName', this.collection.landerName);
          model.set('activeCampaignCollection', this.collection.activeCampaignCollection);
          model.set('deployment_folder_name', this.collection.deployment_folder_name);

          //return options ONLY used by our empty view.
          return {
            isInitializing: this.collection.isInitializing || false
          };
        },

        onRender: function() {


        }

      });
    });
    return Landerds.LandersApp.Landers.List.Deployed.ChildView;
  });
