define(["app",
    "tpl!/assets/js/apps/moonlander/landers/right_sidebar/templates/sidebar_landers.tpl",
    "fancytree",
    "bootstrap"
  ],
  function(Moonlander, sidebarLanders) {

    Moonlander.module("LandersApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {

      RightSidebar.View = Marionette.ItemView.extend({

        template: sidebarLanders,
        tagName: "aside",
        id: "sidebar_right",
        className: "nano affix",
        modelEvents: {
          "change": "render"
        },

        onDomRefresh: function() {
          var me = this;
          $("body").removeClass("external-page");

          $(".close-right-sidebar").click(function(e) {
            me.closeSidebar();
            $(".collapse").collapse('hide');
          });

          $("#jssnippets-tree").fancytree({
            click: function(event, data) {
              var tree = $("#jssnippets-tree").fancytree("getActiveNode");
              // A node is about to be selected: prevent this, for folder-nodes:
              if (data.node.isFolder()) {
                return false;
              }
            },
            renderNode: function(event, data) {
              // Optionally tweak data.node.span
              var node = data.node;
              var $span = $(node.span);


              if ($span.hasClass("fancytree-page")) {
                $span.find("> span.fancytree-icon").html('<i style="font-size: 18px !important" class="fa fa-file fs12 pr5"></i>');
              } else {
                $span.find("> span.fancytree-icon").html('<i style="font-size: 18px !important" class="fa fa-file-code-o text-success fs12 pr5"></i>');
              }

            }
          });
        },

        openSidebar: function(model){
          //if we have a model we are showing completely new lander info
          if(model){
            this.model.set(model.attributes);
          }

          var Body = $("body");
          // If sidebar is set to Horizontal we return
          if ($('body.sb-top').length) {
            return;
          }
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
