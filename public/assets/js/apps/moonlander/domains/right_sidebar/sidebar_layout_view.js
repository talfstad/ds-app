define(["app",
    "tpl!/assets/js/apps/moonlander/domains/right_sidebar/templates/sidebar_landers.tpl",
    "bootstrap"
  ],
  function(Moonlander, sidebarLanders) {

    Moonlander.module("DomainsApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {

      RightSidebar.View = Marionette.LayoutView.extend({

        regions: {
          nameAndOptimizationsRegion: ".name-and-optimizations-region",
        },

        template: sidebarLanders,
        tagName: "aside",
        id: "sidebar_right",
        className: "nano affix",

        events: {
          "click button.lander-edit": "showEditLander",
          "click .delete-lander-button": "showDeleteLanderModal",
          "click .duplicate-lander-button": "showDuplicateLanderModal",
          "click .add-snippet-button": "showJsSnippetsModal"
        },

        modelEvents: {
          "change:deploy_status": "showAlerts"
        },

        //show modified alert if 
        showAlerts: function() {

        },

        showJsSnippetsModal: function(e) {
          Moonlander.trigger("domains:showJsSnippetsModal", this.model);
        },

        showDuplicateLanderModal: function() {
          Moonlander.trigger("domains:showDuplicateLanderModal", this.model);
        },

        showDeleteLanderModal: function() {
          Moonlander.trigger("domains:showDeleteLanderModal", this.model);
        },

        showEditLander: function(e) {
          Moonlander.trigger("domains:showEdit", this.model);
        },

        onBeforeRender: function() {
          urlEndpoints = this.model.get("urlEndpoints")
          var urlEndpointsJSON;
          if (urlEndpoints) {
            urlEndpointsJSON = urlEndpoints.toJSON();
          } else {
            urlEndpointsJSON = [];
          }
          this.model.set("urlEndpointsJSON", urlEndpointsJSON);
        },

        onRender: function() {
          this.$el.find(".test-link-endpoints-select").select2();

          //disable open test link if no endpoints
          if (this.model.get("urlEndpointsJSON").length <= 0) {
            this.$el.find(".open-test-link").addClass("disabled");
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
    return Moonlander.DomainsApp.RightSidebar.View;
  });
