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

        modelEvents: {
          "change:alertBadCampaignName": "alertBadCampaignName"
        },

        events: {
          "click .remove-campaign-button": "showRemoveCampaignModal",
          "click .update-campaign-name-button": "updateCampaignName"
        },

        alertBadCampaignName: function() {
          if (this.model.get("alertBadCampaignName")) {
            this.$el.find(".campaign-name-alert").show();
          } else {
            this.$el.find(".campaign-name-alert").hide();
          }
        },

        updateCampaignName: function() {
          var me = this;

          var name = this.$el.find(".campaign-name-edit").val();

          //can't be empty
          if (name != "") {
            
            this.model.set({
              "alertBadCampaignName": false,
              "name": name
            });

            this.trigger("updateCampaignName");
          } else {
            this.model.set("alertBadCampaignName", true);
          }
        },

        showRemoveCampaignModal: function() {
          Moonlander.trigger("campaigns:showRemoveCampaign", this.model);
        },

        setUpdateCampaignNameButtonState: function(enable) {
          if (enable) {
            this.$el.find(".update-campaign-name-button").removeClass("disabled");
          } else {
            this.$el.find(".update-campaign-name-button").addClass("disabled");
          }
        },

        onRender: function() {
          var me = this;
          this.$el.find(".campaign-name-edit").keyup(function() {
            me.setUpdateCampaignNameButtonState(true);
          });
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
