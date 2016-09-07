define(["app",
    "assets/js/apps/landerds/landers/dao/campaign_model"
  ],
  function(Landerds, CampaignModel) {
    var CampaignCollection = Backbone.Collection.extend({
      url: '/api/campaigns',
      model: CampaignModel,
      comparator: 'campaign',

      filterOutCampaigns: function(campaignsToFilterOutCollection) {

        var items = new CampaignCollection();

        this.each(function(campaign) {
          campaignId = campaign.get("id");

          if (!campaignsToFilterOutCollection.find(function(m) {
              var id = m.get('campaign_id') || m.get('id');
              return id == campaignId
            })) {
            items.add(domain);
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
            error: function(one, two, three) {
              Landerds.execute("show:login");
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

    Landerds.reqres.setHandler("landers:campaignsCollection", function() {
      return API.getCampaignsCollection();
    });

    return CampaignCollection;
  });
