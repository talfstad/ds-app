define(["app",
    "/assets/js/apps/moonlander/campaigns/list/views/campaigns_list_row_view.js",
    "/assets/js/apps/moonlander/campaigns/list/views/list_emptyview_view.js",
    "tpl!/assets/js/apps/moonlander/campaigns/list/templates/list_container.tpl",
    "moment",
    "fancytree",
    "bootstrap"
  ],
  function(Moonlander, landersListItemView, landersEmptyView, landersListContainerTemplate, moment) {

    Moonlander.module("CampaignsApp.Campaigns.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.CollectionView = Marionette.CollectionView.extend({
        id: "campaigns-collection",
        className: "accordion",
        emptyView: landersEmptyView,
        childView: landersListItemView,

        initialize: function() {
          this.listenTo(this, "campaigns:sort", this.triggerSort);
        },

        onRenderCollection: function() {
          // this.attachHtml = function(collectionView, childView, index) {
          //   collectionView.$el.prepend(childView.el);
          // }
        },

        triggerSort: function() {
          var me = this;

          var sortKey = $('input[name=sort-radio]:checked').attr("data-sort-by");
          var sortOrder = $(".btn-group-nav a.active").attr("data-sort-order");

          if (sortKey === "campaign-name") {
            me.collection.comparator = function(a, b) {

              var aCampaignName = a.get("name").toLowerCase();
              var bCampaignName = b.get("name").toLowerCase();

              if (aCampaignName === bCampaignName) {
                return 0;
              } else {
                if (aCampaignName < bCampaignName) {
                  if (sortOrder === 'asc') {
                    return -1;
                  } else {
                    return 1;
                  }
                } else {
                  if (sortOrder === 'asc') {
                    return 1
                  } else {
                    return -1;
                  }
                }
              }
            };

            me.collection.sortFiltered();
            me.collection.trigger('reset');

          } else if (sortKey === "created-on") {

            me.collection.comparator = function(a, b) {

              var aCreatedOn = moment(new Date(a.get("created_on"))).unix();
              var bCreatedOn = moment(new Date(b.get("created_on"))).unix();

              if (aCreatedOn === bCreatedOn) {
                return 0;
              } else {
                if (aCreatedOn < bCreatedOn) {
                  if (sortOrder === 'asc') {
                    return -1;
                  } else {
                    return 1;
                  }
                } else {
                  if (sortOrder === 'asc') {
                    return 1
                  } else {
                    return -1;
                  }
                }
              }
            };

            me.collection.sortFiltered();
          }

        },

        onDomRefresh: function() {

          $(".collapse").collapse({
            toggle: false,
            parent: "#campaigns-collection"
          });
        }
      });

    });
    return Moonlander.CampaignsApp.Campaigns.List.CollectionView;
  });