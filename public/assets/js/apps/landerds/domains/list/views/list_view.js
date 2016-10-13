define(["app",
    "assets/js/apps/landerds/domains/list/views/domains_list_row_view",
    "assets/js/apps/landerds/domains/list/views/list_emptyview_view",
    "tpl!assets/js/apps/landerds/domains/list/templates/list_container.tpl",
    "moment",
    "fancytree",
    "bootstrap"
  ],
  function(Landerds, landersListItemView, landersEmptyView, landersListContainerTemplate, moment) {

    Landerds.module("DomainsApp.Domains.List", function(List, Landerds, Backbone, Marionette, $, _) {

      List.View = Marionette.CollectionView.extend({
        id: "list-collection",
        className: "accordion",
        emptyView: landersEmptyView,
        childView: landersListItemView,

        initialize: function() {
          this.listenTo(this, "domains:sort", this.triggerSort);
        },

        triggerSort: function() {
          var me = this;

          var sortKey = $('input[name=sort-radio]:checked').attr("data-sort-by");
          var sortOrder = $(".btn-group-nav a.active").attr("data-sort-order");

          if (sortKey === "domain-name") {
            me.collection.comparator = function(a, b) {

              var aDomainName = a.get("domain").toLowerCase();
              var bDomainName = b.get("domain").toLowerCase();

              if (aDomainName === bDomainName) {
                return 0;
              } else {
                if (aDomainName < bDomainName) {
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
            parent: "#list-collection"
          });
        }
      });

    });
    return Landerds.DomainsApp.Domains.List.View;
  });
