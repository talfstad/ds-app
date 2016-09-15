define(["app",
    "assets/js/apps/landerds/groups/list/domains/views/domain_row_view",
    "assets/js/apps/landerds/groups/list/domains/views/domain_empty_view"
  ],
  function(Landerds, DeployedDomainRowView, EmptyView) {

    Landerds.module("GroupsApp.Groups.List.Domain", function(Domain, Landerds, Backbone, Marionette, $, _) {
      Domain.DeployedDomainsCollectionView = Marionette.CollectionView.extend({
        tagName: "tbody",

        childEvents: {
          "gotoEditDomain": "gotoEditDomain"
        },

        gotoEditDomain: function(childView) {

          var groupId = childView.model.get("group_id");;
          var domainId = childView.model.get("domain_id");;

          //save this domain so on back button it reopens the domain
          Landerds.navigate("groups/show/" + groupId);
          //go to edit the lander
          Landerds.trigger("domains:list", domainId);
        },


        onAddChild: function(childView) {
          this.reIndex();
        },

        onRemoveChild: function(childView) {
          this.reIndex();
        },

        reIndex: function() {
          this.collection.each(function(domainListModel, idx) {
            domainListModel.set("viewIndex", idx + 1);
          });
        },

        //pass the deployed list its rendered index for # column
        childViewOptions: function(model) {
          model.set('viewIndex', parseInt(this.collection.indexOf(model)) + 1);
          model.set('group_id', this.collection.group_id);
          // model.set("name", this.collection.name);
        },

        childView: DeployedDomainRowView,
        emptyView: EmptyView

      });
    });
    return Landerds.GroupsApp.Groups.List.Domain.DeployedDomainsCollectionView;
  });
