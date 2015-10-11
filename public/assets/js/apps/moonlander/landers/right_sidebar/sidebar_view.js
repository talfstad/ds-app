define(["app",
    "tpl!/assets/js/apps/moonlander/landers/right_sidebar/templates/sidebar_landers.tpl",
    "fancytree",
    "bootstrap"
  ],
  function(Moonlander, sidebarLanders) {

    Moonlander.module("LandersApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {

      RightSidebar.View = Marionette.LayoutView.extend({

        regions: {
          snippetsRegion: "#jssnippets-tree-container"
        },

        template: sidebarLanders,
        tagName: "aside",
        id: "sidebar_right",
        className: "nano affix",
        modelEvents: {
          "change": "render"
        },

        events: {
          "click button.lander-edit": "showEditLander"
        },

        showEditLander: function(e){ 
          Moonlander.trigger("landers:showEdit", this.model);
        },

        onDomRefresh: function() {
          var me = this;
          $("body").removeClass("external-page");

          $(".close-right-sidebar").click(function(e) {
            me.closeSidebar();
            $(".collapse").collapse('hide');
          });
        },

        openSidebar: function(model){
          //if we have a model we are showing completely new lander info
          // if(model){
          //   this.model.set(model.attributes);
          // }

          var Body = $("body");
          if (!Body.hasClass('sb-r-o')) {
            Body.addClass('sb-r-o').removeClass("sb-r-c");
          }
        },
        closeSidebar: function(){
          var Body = $("body");
          // If sidebar is set to Horizontal we return
          if ($('body.sb-top').length) {
            return;
          }
          if (!Body.hasClass('sb-r-c')) {
            Body.addClass('sb-r-c').removeClass("sb-r-o");
          }
        }

      });


    });
    return Moonlander.LandersApp.RightSidebar.View;
  });
