define(["app",
    "assets/js/apps/landerds/groups/list/deployed_landers/views/deployed_lander_row_view",
    "assets/js/apps/landerds/groups/list/deployed_landers/views/deployed_landers_empty_view",
    "assets/js/apps/landerds/base_classes/deployed_rows/views/deployed_rows_collection_base_view"
  ],
  function(Landerds, DeployedDomainRowView, EmptyView, DeployedRowsCollectionBaseView) {

    Landerds.module("GroupsApp.Groups.List.Deployed", function(Deployed, Landerds, Backbone, Marionette, $, _) {
      Deployed.ChildView = DeployedRowsCollectionBaseView.extend({
        tagName: "tbody",
        childView: DeployedDomainRowView,
        emptyView: EmptyView,

        childEvents: {
          "getLoadTime": "getLoadTime",
          "gotoEditLander": "gotoEditLander"
        },

        collectionEvents: {
          "domainsChanged": "render"
        },

        gotoEditLander: function(childView) {

          var landerId = childView.model.get("lander_id");;
          var groupId = childView.model.get("group_id");;

          //save this domain so on back button it reopens the domain
          Landerds.navigate("groups/show/" + groupId);
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

        childViewOptions: function(model) {
          model.set('viewIndex', parseInt(this.collection.indexOf(model)) + 1);
        }

      });
    });
    return Landerds.GroupsApp.Groups.List.Deployed.ChildView;
  });
