define(["app",
    "assets/js/apps/landerds/groups/list/views/groups_list_row_view",
    "assets/js/apps/landerds/groups/list/views/list_emptyview_view",
    "tpl!assets/js/apps/landerds/groups/list/templates/list_container.tpl",
    "moment",
    "fancytree",
    "bootstrap"
  ],
  function(Landerds, landersListItemView, landersEmptyView, landersListContainerTemplate, moment) {

    Landerds.module("GroupsApp.Groups.List", function(List, Landerds, Backbone, Marionette, $, _) {

      List.CollectionView = Marionette.CollectionView.extend({
        id: "list-collection",
        className: "accordion",
        emptyView: landersEmptyView,
        childView: landersListItemView,

        initialize: function() {
          this.listenTo(this, "groups:sort", this.triggerSort);
        },

        childEvents: {
          "saveGroupName": "saveGroupName"
        },

        saveGroupName: function(childView, landerName) {
          var groupModel = childView.model;
          //save this lander name to the DB
          groupModel.set("name", landerName);
          groupModel.save({}, {
            success: function(model, two, three) {
              //when the landername changes change the name, resort, goto page, open
              groupModel.trigger("resortAndExpandModelView");
            }
          });
        },

        triggerSort: function() {
          var me = this;

          var sortKey = $('input[name=sort-radio]:checked').attr("data-sort-by");
          var sortOrder = $(".btn-group-nav a.active").attr("data-sort-order");

          if (sortKey === "group-name") {
            me.collection.original.comparator = function(a, b) {

              var aGroupName = a.get("name").toLowerCase();
              var bGroupName = b.get("name").toLowerCase();

              if (aGroupName === bGroupName) {
                return 0;
              } else {
                if (aGroupName < bGroupName) {
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

            me.collection.original.comparator = function(a, b) {

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
    return Landerds.GroupsApp.Groups.List.CollectionView;
  });
