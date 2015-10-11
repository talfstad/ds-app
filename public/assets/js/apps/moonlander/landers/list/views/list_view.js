define(["app",
    "/assets/js/apps/moonlander/landers/list/views/list_childview_view.js",
    "/assets/js/apps/moonlander/landers/list/views/list_emptyview_view.js",
    "tpl!/assets/js/apps/moonlander/landers/list/templates/list_container.tpl",
    "fancytree",
    "bootstrap"
  ],
  function(Moonlander, landersListItemView, landersEmptyView, landersListContainerTemplate) {

    Moonlander.module("LandersApp.Landers.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.View = Marionette.CompositeView.extend({
        id: "landers-collection",
        template: landersListContainerTemplate,
        emptyView: landersEmptyView,
        childView: landersListItemView,
        childViewContainer: "div#landers-collection-items",

        // collectionEvents: {
        //   'change': 'render'
        // },

        initialize: function() {
          this.listenTo(this, "landers:sort", this.triggerSort);
        },

        onRenderCollection: function() {
          // this.attachHtml = function(collectionView, childView, index) {
          //   collectionView.$el.prepend(childView.el);
          // }
        },

        triggerSort: function(){
          var me = this;
          
          var sortKey = $('input[name=sort-radio]:checked').attr("data-sort-by");
          var sortOrder = $(".btn-group-nav a.active").attr("data-sort-order");

          if (sortKey === "lander-name") {
            me.collection.comparator = function(a, b) {

              var aLanderName = a.get("name"); 
              var bLanderName = b.get("name");

              if(aLanderName === bLanderName) {
                return 0;
              } else {
                if(aLanderName < bLanderName) {
                  if(sortOrder === 'asc') {
                    return -1;
                  } else {
                    return 1;
                  }
                } else {
                  if(sortOrder === 'asc') {
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
            
            me.collection.comparator = function(a, b) {

              var aLanderName = a.get("lastUpdated"); 
              var bLanderName = b.get("lastUpdated");

              if(aLanderName === bLanderName) {
                return 0;
              } else {
                if(aLanderName < bLanderName) {
                  if(sortOrder === 'asc') {
                    return -1;
                  } else {
                    return 1;
                  }
                } else {
                  if(sortOrder === 'asc') {
                    return 1
                  } else {
                    return -1; 
                  }
                }
              }
            };

            me.collection.sortFiltered();
          } else if(sortKey === "deployed") {
            me.collection.comparator = function(a, b) {

              //DEPLOYING
              //deployed == true, deploying == true

              //DEPLOYED
              //deployed == true, deploying == false

              //NOT DEPLOYED
              //deployed == false, deploying == false

              var aDeployed = a.get("deployed");
              var aDeploying = a.get("deploying");
              var bDeployed = b.get("deployed");
              var bDeploying = a.get("deploying");

              

              // var aIsDeployed = false;
              // var aIsDeploying = false;
              // var bIsDeployed = false;
              // var bIsDeploying = false;
              

              // if(aDeploying && aDeploying) {
              //   aIsDeploying = true;
              // }
              // if(aDeployed && !aDeploying) {
              //   aIsDeployed = true;
              // }
              // if(bDeploying && bDeploying) {
              //   bIsDeploying = true;
              // }
              // if(bDeployed && !bDeploying) {
              //   bIsDeployed = true;
              // }

              // if(aIsDeployed && bIsDeployed) return 0;
              // if(aIsDeploying && bIsDeploying) return 0;
              // if(!aIsDeployed && !bIsDeploying) return 0;

              // if(aIsDeployed) {
              //   if(sortOrder === 'asc') {
              //     return -1;
              //   } else {
              //     return 1;
              //   }
              // }

              // if(bIsDeployed) {
              //   if(sortOrder === 'asc') {
              //     return 1;
              //   } else {
              //     return -1;
              //   }
              // }

              // if(aIsDeploying) {
              //   if(sortOrder === 'asc') {
              //     return -1;
              //   } else {
              //     return 1;
              //   }
              // }

              // if(bIsDeploying) {
              //   if(sortOrder === 'asc') {
              //     return 1;
              //   } else {
              //     return -1;
              //   }
              // }

              // return 0;
            
            };
            me.collection.sortFiltered();
          }
          
        },

        onDomRefresh: function() {


        }
      });

    });
    return Moonlander.LandersApp.Landers.List.View;
  });