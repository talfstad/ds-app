define(["app",
    "assets/js/apps/landerds/domains/list/active_groups/views/active_group_row_view",
    "assets/js/apps/landerds/domains/list/active_groups/views/active_group_empty_view"
  ],
  function(Landerds, ActiveGroupsRowView, EmptyView) {

    Landerds.module("DomainsApp.Domains.List.ActiveGroups", function(ActiveGroups, Landerds, Backbone, Marionette, $, _) {
      ActiveGroups.ChildView = Marionette.CollectionView.extend({
        tagName: "table",
        className: "table",

        childEvents: {
          "gotoEditGroup": "gotoEditGroup"
        },

        gotoEditGroup: function(childView) {
          var domainId = childView.model.get("domain_id");;
          var groupId = childView.model.get("group_id");;

          //save this domain so on back button it reopens the domain
          Landerds.navigate("domains/show/" + domainId);
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
          model.set("domain", this.collection.domain_model.get("domain"));
        },

        childView: ActiveGroupsRowView,
        emptyView: EmptyView

      });
    });
    return Landerds.DomainsApp.Domains.List.ActiveGroups.ChildView;
  });
