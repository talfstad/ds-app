define(["app",
    "tpl!assets/js/apps/landerds/landers/right_sidebar/templates/url_endpoints.tpl"
  ],
  function(Landerds, UrlEndpiontsTpl, Notification) {

    Landerds.module("LandersApp.RightSidebar", function(RightSidebar, Landerds, Backbone, Marionette, $, _) {

      RightSidebar.UrlEndpointsView = Marionette.ItemView.extend({

        template: UrlEndpiontsTpl,
        className: "btn-group ",

        events: {
          "click .open-preview-link": "openPreviewLink",
          "change .preview-link-endpoints-select": "updateCurrentEndpoint"
        },

        updateCurrentEndpoint: function() {
          var currentEndpointId = $('.preview-link-endpoints-select').val();
          if (currentEndpointId) {
            this.model.set("currentPreviewEndpointId", parseInt(currentEndpointId));
          }
        },

        openPreviewLink: function(e) {
          e.preventDefault();

          // <aws_root_bucket>.s3-website-us-west-2.amazonaws.com/<user>/landers/<s3_folder_name>
          var rootBucket = Landerds.loginModel.get("aws_root_bucket");
          var username = Landerds.loginModel.get("username");
          var s3FolderName = this.model.get("s3_folder_name");
          var filename = $(".preview-link-endpoints-select option:selected").text().trim();
          var link = "http://" + rootBucket + ".s3-website-us-west-2.amazonaws.com/" + username + "/landers/" + s3FolderName + "/original/" + filename;

          window.open(link, '_blank');
          return false;
        },


        onBeforeRender: function() {
          urlEndpoints = this.model.get("urlEndpoints");
          var urlEndpointsJSON;
          if (urlEndpoints) {
            urlEndpointsJSON = urlEndpoints.toJSON();
          } else {
            urlEndpointsJSON = [];
          }

          this.model.set("urlEndpointsJSON", urlEndpointsJSON);
          this.model.set("currentPreviewEndpointId", urlEndpointsJSON[0].id);
        },

        onRender: function() {
          this.$el.find(".preview-link-endpoints-select").select2();

          //disable open preview link if no endpoints
          if (this.model.get("urlEndpointsJSON").length <= 0) {
            this.$el.find(".open-preview-link").addClass("disabled");
          } else {

          }
        }
      });


    });
    return Landerds.LandersApp.RightSidebar.UrlEndpointsView;
  });
