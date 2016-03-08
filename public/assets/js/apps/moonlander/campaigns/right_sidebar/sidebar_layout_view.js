define(["app",
    "tpl!assets/js/apps/moonlander/campaigns/right_sidebar/templates/sidebar_campaigns.tpl",
    "bootstrap"
  ],
  function(Moonlander, sidebarLanders) {

    Moonlander.module("CampaignsApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {

      RightSidebar.View = Marionette.LayoutView.extend({

        template: sidebarLanders,
        tagName: "aside",
        id: "sidebar_right",
        className: "nano affix",

        events: {
          "click .delete-domain-button": "showDeleteDomainModal",
        },

      
        showDeleteDomainModal: function() {
          Moonlander.trigger("domains:showDeleteDomainModal", this.model);
        },

        onRender: function() {

        },

        onDomRefresh: function() {
          var me = this;
          $("body").removeClass("external-page");

          $(".close-right-sidebar").click(function(e) {
            me.closeSidebar();
            $(".collapse").collapse('hide');
          });
        },

        openSidebar: function(model) {
          var Body = $("body");
          if (!Body.hasClass('sb-r-o')) {
            Body.addClass('sb-r-o').removeClass("sb-r-c");
          }
        },

        closeSidebar: function() {
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
    return Moonlander.CampaignsApp.RightSidebar.View;
  });
