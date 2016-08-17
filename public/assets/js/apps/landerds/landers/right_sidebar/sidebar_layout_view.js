define(["app",
    "tpl!assets/js/apps/landerds/landers/right_sidebar/templates/sidebar_landers.tpl",
    "assets/js/common/notification"
  ],
  function(Landerds, sidebarLanders, Notification) {

    Landerds.module("LandersApp.RightSidebar", function(RightSidebar, Landerds, Backbone, Marionette, $, _) {

      RightSidebar.View = Marionette.LayoutView.extend({

        regions: {
          menuButtonsRegion: ".menu-buttons-region",
          snippetsRegion: "#jssnippets-tree",
          deploymentOptionsRegion: ".deployment-options-region",
          landerModifiedRegion: ".lander-modified-region",
          urlEndpointsRegion: ".url-endpoints-region",
          pagespeedRegion: ".pagespeed-region"
        },

        template: sidebarLanders,
        tagName: "aside",
        id: "sidebar_right",
        className: "nano affix",

        events: {
          // "click button.lander-edit": "showEditLander",
          "click .delete-lander-button": "showDeleteLanderModal",
          "click .duplicate-lander-button": "showDuplicateLanderModal",
          "click .add-snippet-button": "showJsSnippetsModal",
          "click .download-original-lander": "onDownloadOriginal",
          "click .download-optimized-lander": "onDownloadOptimized"
        },

        modelEvents: {
          "change:deploy_status": "showAlerts"
        },

        //show modified alert if 
        showAlerts: function() {

        },

        showJsSnippetsModal: function(e) {
          Landerds.trigger("landers:showJsSnippetsModal", this.model);
        },

        showEmptyViewJsSnippetsModal: function(e) {
          Landerds.trigger("landers:showEmptyJsSnippetsModal", this.model);
        },

        showDuplicateLanderModal: function() {
          Landerds.trigger("landers:showDuplicateLanderModal", this.model.attributes);
        },

        showDeleteLanderModal: function() {
          Landerds.trigger("landers:showDeleteLanderModal", this.model);
        },

        showEditLander: function(e) {
          Landerds.trigger("landers:showEdit", this.model);
        },

        onDownloadOriginal: function(e) {
          var link = $(e.currentTarget);
          if (link.hasClass("disabled-link")) {
            return false;
          } else {
            Notification("Downloading Original", "Download will begin shortly", "success", "stack_top_right");
            link.addClass("disabled-link");
            setTimeout(function() {
              link.removeClass("disabled-link");
            }, 10000);
          }
        },

        onDownloadOptimized: function(e) {
          var link = $(e.currentTarget);
          if (link.hasClass("disabled-link")) {
            return false;
          } else {
            Notification("Downloading Optimized", "Download will begin shortly...", "success", "stack_top_right");
            link.addClass("disabled-link");
            setTimeout(function() {
              link.removeClass("disabled-link");
            }, 10000);
          }
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
    return Landerds.LandersApp.RightSidebar.View;
  });
