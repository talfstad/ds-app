define(["app",
    "assets/js/apps/landerds/campaigns/list/domains/views/domain_row_view",
    "assets/js/apps/landerds/campaigns/list/domains/views/domain_empty_view"
  ],
  function(Landerds, DeployedDomainRowView, EmptyView) {

    Landerds.module("CampaignsApp.Campaigns.List.Domain", function(Domain, Landerds, Backbone, Marionette, $, _) {
      Domain.DeployedDomainsCollectionView = Marionette.CollectionView.extend({
        tagName: "tbody",

        childEvents: {
          "gotoEditDomain": "gotoEditDomain"
        },

        gotoEditDomain: function(childView) {

          var campaignId = childView.model.get("campaign_id");;
          var domainId = childView.model.get("domain_id");;

          //save this domain so on back button it reopens the domain
          Landerds.navigate("campaigns/show/" + campaignId);
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
          model.set('campaign_id', this.collection.campaign_id);
          // model.set("name", this.collection.name);
        },

        childView: DeployedDomainRowView,
        emptyView: EmptyView

      });
    });
    return Landerds.CampaignsApp.Campaigns.List.Domain.DeployedDomainsCollectionView;
  });
