define(["app",
    "tpl!assets/js/apps/landerds/domains/right_sidebar/templates/sidebar_landers.tpl",
    "bootstrap"
  ],
  function(Landerds, sidebarLanders) {

    Landerds.module("DomainsApp.RightSidebar", function(RightSidebar, Landerds, Backbone, Marionette, $, _) {

      RightSidebar.View = Marionette.LayoutView.extend({

        regions: {
          nameAndOptimizationsRegion: ".name-and-optimizations-region",
        },

        template: sidebarLanders,
        tagName: "aside",
        id: "sidebar_right",
        className: "nano affix",

        events: {
          "click .delete-domain-button": "showDeleteDomainModal",
        },


        showJsSnippetsModal: function(e) {
          Landerds.trigger("domains:showJsSnippetsModal", this.model);
        },

        showDeleteDomainModal: function() {
          Landerds.trigger("domains:showDeleteDomainModal", this.model);
        },

        showEditLander: function(e) {
          Landerds.trigger("domains:showEdit", this.model);
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

          if ($(".docs-container.active").length) {
            //set padding for documentation if it is open
            var newHeight = $(".docs-container").height();
            $(".sidebar-right-content > .panel").css("padding-bottom", newHeight + "px");
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
    return Landerds.DomainsApp.RightSidebar.View;
  });
