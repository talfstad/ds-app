define(["app",
    "/assets/js/apps/moonlander/campaigns/dao/campaign_model.js"
  ],
  function(Moonlander, CampaignModel) {
    var CampaignCollection = Backbone.Collection.extend({
      url: '/api/campaigns',
      model: CampaignModel,
      comparator: function(doc) {
        var str = doc.get('name') || '';
        return str.toLowerCase();
      },

      filterOutCampaigns: function(campaignsToFilterOutCollection) {

        var items = new CampaignCollection();

        this.each(function(campaign){
          campaignId = campaign.get("id");

          if(!campaignsToFilterOutCollection.get(campaignId)) {
            items.add(campaign);
          }
        });

        return items;
      }

    });

    var campaignCollectionInstance = null;

    var API = {
      getCampaignsCollection: function() {
        var me = this;
        var defer = $.Deferred();

          campaignCollectionInstance = new CampaignCollection();

          campaignCollectionInstance.fetch({
            success: function(campaigns) {
              defer.resolve(campaigns);
            },
            error: function(one, two, three){
              Moonlander.execute("show:login");
            }
          });
        

        var promise = defer.promise();
        return promise;
      }
    };

    Moonlander.reqres.setHandler("campaigns:campaignsCollection", function() {
      return API.getCampaignsCollection();
    });

    return CampaignCollection;
  });
