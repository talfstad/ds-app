define(["app",
    "tpl!assets/js/apps/moonlander/landers/right_sidebar/templates/sidebar_landers.tpl",
    "bootstrap"
  ],
  function(Moonlander, sidebarLanders) {

    Moonlander.module("LandersApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {

      RightSidebar.View = Marionette.LayoutView.extend({

        regions: {
          menuButtonsRegion: ".menu-buttons-region",
          snippetsRegion: "#jssnippets-tree",
          nameAndOptimizationsRegion: ".name-and-optimizations-region",
          landerModifiedRegion: ".lander-modified-region"
        },

        template: sidebarLanders,
        tagName: "aside",
        id: "sidebar_right",
        className: "nano affix",

        events: {
          "click button.lander-edit": "showEditLander",
          "click .delete-lander-button": "showDeleteLanderModal",
          "click .duplicate-lander-button": "showDuplicateLanderModal",
          "click .add-snippet-button": "showJsSnippetsModal",
          "click .open-preview-link": "openPreviewLink"
        },

        modelEvents: {
          "change:deploy_status": "showAlerts"
        },

        openPreviewLink: function(e){
          e.preventDefault();

          // <aws_root_bucket>.s3-website-us-west-2.amazonaws.com/<user>/landers/<s3_folder_name>
          var rootBucket = Moonlander.loginModel.get("aws_root_bucket");
          var username = Moonlander.loginModel.get("username");
          var s3FolderName = this.model.get("s3_folder_name");
          var filename = $(".preview-link-endpoints-select option:selected").text().trim();
          var link = "http://" + rootBucket + ".s3-website-us-west-2.amazonaws.com/" + username + "/landers/" + s3FolderName + "/" + filename;

          window.open(link, '_blank');
          return false;

        },

        //show modified alert if 
        showAlerts: function() {

        },

        showJsSnippetsModal: function(e) {
          Moonlander.trigger("landers:showJsSnippetsModal", this.model);
        },

        showDuplicateLanderModal: function() {
          Moonlander.trigger("landers:showDuplicateLanderModal", this.model);
        },

        showDeleteLanderModal: function() {
          Moonlander.trigger("landers:showDeleteLanderModal", this.model);
        },

        showEditLander: function(e) {
          Moonlander.trigger("landers:showEdit", this.model);
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
          this.$el.find(".preview-link-endpoints-select").select2();

          //disable open preview link if no endpoints
          if (this.model.get("urlEndpointsJSON").length <= 0) {
            this.$el.find(".open-preview-link").addClass("disabled");
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
    return Moonlander.LandersApp.RightSidebar.View;
  });
