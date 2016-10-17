define(["app",
    "assets/js/apps/landerds/landers/list/views/landers_list_row_view",
    "assets/js/apps/landerds/landers/list/views/list_emptyview_view",
    "tpl!assets/js/apps/landerds/landers/list/templates/list_container.tpl",
    "moment",
    "fancytree",
    "bootstrap"
  ],
  function(Landerds, landersListRowView, landersEmptyView, landersListContainerTemplate, moment) {

    Landerds.module("LandersApp.Landers.List", function(List, Landerds, Backbone, Marionette, $, _) {

      List.View = Marionette.CollectionView.extend({
        id: "list-collection",
        className: "accordion",
        emptyView: landersEmptyView,
        childView: landersListRowView,

        initialize: function() {
          this.listenTo(this, "landers:sort", this.triggerSort);
        },

        childEvents: {
          "saveLanderName": "saveLanderName"
        },

        saveLanderName: function(childView, landerName, e) {
          var me = this;
          var landerModel = childView.model;
          landerModel.set("name", landerName);
          var landerNameInput;
          if (e) {
            landerNameInput = $(e.currentTarget);
          } else {
            landerNameInput = childView.$el.find("input.editable-lander-name");
          }
          
          landerModel.saveName(function() {
            //flash success check next to button
            var successEl = $("<i class='fa fa-check-circle text-success'></i>");
            landerNameInput.after(successEl);
            successEl.fadeOut('slow', function() {
              successEl.remove();
              //resort
              me.triggerSort();
              me.trigger("showPageWithModel", landerModel);
            });
          });
        },

        triggerSort: function() {
          var me = this;

          var sortKey = $('input[name=sort-radio]:checked').attr("data-sort-by");
          var sortOrder = $(".btn-group-nav a.active").attr("data-sort-order");

          if (sortKey === "lander-name") {
            me.collection.original.comparator = function(a, b) {

              var aLanderName = a.get("name").toLowerCase();
              var bLanderName = b.get("name").toLowerCase();

              if (aLanderName === bLanderName) {
                return 0;
              } else {
                if (aLanderName < bLanderName) {
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

          } else if (sortKey === "last-updated") {

            me.collection.original.comparator = function(a, b) {

              var aLastUpdated = moment(new Date(a.get("created_on"))).unix();
              var bLastUpdated = moment(new Date(b.get("created_on"))).unix();

              if (aLastUpdated === bLastUpdated) {
                return 0;
              } else {
                if (aLastUpdated < bLastUpdated) {
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
          } else if (sortKey === "deployed") {
            me.collection.original.comparator = function(a, b) {

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
    return Landerds.LandersApp.Landers.List.View;
  });
