define(["app",
    "/assets/js/apps/moonlander/domains/list/views/list_childview_view.js",
    "/assets/js/apps/moonlander/domains/list/views/list_emptyview_view.js",
    "tpl!/assets/js/apps/moonlander/domains/list/templates/list_container.tpl",
    "moment",
    "fancytree",
    "bootstrap"
  ],
  function(Moonlander, landersListItemView, landersEmptyView, landersListContainerTemplate, moment) {

    Moonlander.module("DomainsApp.Domains.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.View = Marionette.CollectionView.extend({
        id: "landers-collection",
        className: "accordion",
        emptyView: landersEmptyView,
        childView: landersListItemView,
        
        initialize: function() {
          this.listenTo(this, "domains:sort", this.triggerSort);
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

              var aLanderName = a.get("name").toLowerCase(); 
              var bLanderName = b.get("name").toLowerCase();

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

              var aLastUpdated = moment(new Date(a.get("last_updated"))).unix(); 
              var bLastUpdated = moment(new Date(b.get("last_updated"))).unix();

              if(aLastUpdated === bLastUpdated) {
                return 0;
              } else {
                if(aLastUpdated < bLastUpdated) {
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

          $(".collapse").collapse({
            toggle: false,
            parent: "#landers-collection"
          });
        }
      });

    });
    return Moonlander.DomainsApp.Domains.List.View;
  });