define(["app",
    "/assets/js/apps/moonlander/landers/list/views/list_childview_view.js",
    "/assets/js/apps/moonlander/landers/list/views/list_emptyview_view.js",
    "tpl!/assets/js/apps/moonlander/landers/list/templates/list_container.tpl",
    "fancytree",
    "bootstrap"
  ],
  function(Moonlander, landersListItemView, landersEmptyView, landersListContainerTemplate) {

    Moonlander.module("LandersApp.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.View = Marionette.CompositeView.extend({
        id: "landers-collection",
        template: landersListContainerTemplate,
        emptyView: landersEmptyView,
        childView: landersListItemView,
        childViewContainer: "div",


        initialize: function() {
          // this.listenTo(this, "landers:edit:notify", this.notify); 
        },


        onRenderCollection: function() {
          // this.attachHtml = function(collectionView, childView, index) {
          //   collectionView.$el.prepend(childView.el);
          // }
        },



        onDomRefresh: function() {

          //needed to init correctly. avoids initial toggle on button click (expand/collapse all)
          $(".collapse").collapse({
            toggle: false
          });

          



        }
      });





    });
    return Moonlander.LandersApp.List.View;
  });
