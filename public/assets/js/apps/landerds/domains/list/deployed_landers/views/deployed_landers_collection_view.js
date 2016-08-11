define(["app",
    "assets/js/apps/landerds/domains/list/deployed_landers/views/deployed_lander_row_view",
    "assets/js/apps/landerds/domains/list/deployed_landers/views/deployed_landers_empty_view",
    "assets/js/apps/landerds/base_classes/deployed_rows/views/deployed_rows_collection_base_view"
  ],
  function(Landerds, DeployedDomainRowView, EmptyView, DeployedRowsCollectionBaseView) {

    Landerds.module("DomainsApp.Domains.List.Deployed", function(Deployed, Landerds, Backbone, Marionette, $, _) {
      Deployed.ChildView = DeployedRowsCollectionBaseView.extend({
        tagName: "tbody",
        childView: DeployedDomainRowView,
        emptyView: EmptyView,

        childEvents: {
          "getLoadTime": "getLoadTime",
          "gotoEditLander": "gotoEditLander"
        },

        gotoEditLander: function(childView) {
          
          var landerId = childView.model.get("lander_id");;
          var domainId = childView.model.get("domain_id");;

          //save this domain so on back button it reopens the domain
          Landerds.navigate("domains/show/" + domainId);
          //go to edit the lander
          Landerds.trigger("landers:list", landerId);
        },

        onAddChild: function(childView) {
          this.reIndex();
        },

        onRemoveChild: function(childView) {
          this.reIndex();
        },

        reIndex: function() {
          this.collection.each(function(deployedLanderModel, idx) {
            deployedLanderModel.set("viewIndex", idx + 1);
          });
        },

        //pass the deployed list its rendered index for # column
        childViewOptions: function(model) {
          model.set('viewIndex', parseInt(this.collection.indexOf(model)) + 1);
          model.set('domain', this.collection.domain);
          model.set('domain_id', this.collection.domain_id);
          model.set('activeCampaignCollection', this.collection.activeCampaignCollection);
          //return options ONLY used by our empty view.
          return {
            isInitializing: this.collection.isInitializing || false
          };
        },

        onRender: function() {



        }

      });
    });
    return Landerds.DomainsApp.Domains.List.Deployed.ChildView;
  });
