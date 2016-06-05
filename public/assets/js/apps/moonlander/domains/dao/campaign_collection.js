define(["app",
    "assets/js/apps/moonlander/domains/dao/campaign_model"
  ],
  function(Moonlander, CampaignModel) {
    var CampaignCollection = Backbone.Collection.extend({
      url: '/api/campaigns',
      model: CampaignModel,
      comparator: 'campaign',

      filterOutCampaigns: function(campaignsToFilterOutCollection) {

        var items = new CampaignCollection();

        this.each(function(campaign) {
          campaignId = campaign.get("id");

          if (!campaignsToFilterOutCollection.find(function(m) {
              var id = m.get('campaign_id') || m.get('id')
              return id == campaignId
            })) {
            items.add(campaign);
          }

        });

        return items;
      }

    });


    var API = {
      getCampaignsCollection: function() {
        var me = this;
        var defer = $.Deferred();


        this.campaignCollectionInstance = new CampaignCollection();

        this.campaignCollectionInstance.fetch({
          success: function(campaigns) {
            defer.resolve(campaigns);
          },
          error: function(one, two, three) {
            Moonlander.execute("show:login");
          }
        });


        var promise = defer.promise();
        return promise;
      }
    };

    Moonlander.reqres.setHandler("domains:campaignsCollection", function() {
      return API.getCampaignsCollection();
    });

    return CampaignCollection;
  });
