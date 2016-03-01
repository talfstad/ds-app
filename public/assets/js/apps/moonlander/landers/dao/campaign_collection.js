define(["app",
    "/assets/js/apps/moonlander/landers/dao/campaign_model.js"
  ],
  function(Moonlander, CampaignModel) {
    var CampaignCollection = Backbone.Collection.extend({
      url: '/api/campaigns',
      model: CampaignModel,
      comparator: 'campaign',

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

        if (!this.campaignCollectionInstance) {

          this.campaignCollectionInstance = new CampaignCollection();

          this.campaignCollectionInstance.fetch({
            success: function(campaigns) {
              defer.resolve(campaigns);
            },
            error: function(one, two, three){
              Moonlander.execute("show:login");
            }
          });
        } else {
          //async hack to still return defer
          setTimeout(function() {
            defer.resolve(me.campaignCollectionInstance);
          }, 100);
        }

        var promise = defer.promise();
        return promise;
      }
    };

    Moonlander.reqres.setHandler("campaigns:campaignsCollection", function() {
      return API.getCampaignsCollection();
    });

    return CampaignCollection;
  });
