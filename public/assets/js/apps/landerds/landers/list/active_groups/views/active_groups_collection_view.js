define(["app",
    "assets/js/apps/landerds/landers/list/active_groups/views/active_group_row_view",
    "assets/js/apps/landerds/landers/list/active_groups/views/active_group_empty_view"
  ],
  function(Landerds, ActiveGroupsRowView, EmptyView) {

    Landerds.module("LandersApp.Landers.List.ActiveGroups", function(ActiveGroups, Landerds, Backbone, Marionette, $, _) {
      ActiveGroups.ChildView = Marionette.CollectionView.extend({
        tagName: "table",
        className: "table",

        childEvents: {
          "gotoEditGroup": "gotoEditGroup"
        },

        gotoEditGroup: function(childView) {
          var landerId = childView.model.get("lander_id");;
          var groupId = childView.model.get("group_id");;

          //save this domain so on back button it reopens the domain
          Landerds.navigate("landers/show/" + landerId);
          //go to edit the lander
          Landerds.trigger("groups:list", groupId);
        },

        onAddChild: function(childView) {
          this.reIndex();
        },

        onRemoveChild: function(childView) {
          this.reIndex();
        },

        reIndex: function() {
          this.collection.each(function(activeGroupModel, idx) {
            activeGroupModel.set("viewIndex", idx + 1);
          });
        },

        //pass the deployed list its rendered index for # column
        childViewOptions: function(model) {
          model.set('viewIndex', parseInt(this.collection.indexOf(model)) + 1);
          model.set("landerName", this.collection.landerName);
        },

        childView: ActiveGroupsRowView,
        emptyView: EmptyView

      });
    });
    return Landerds.LandersApp.Landers.List.ActiveGroups.ChildView;
  });
