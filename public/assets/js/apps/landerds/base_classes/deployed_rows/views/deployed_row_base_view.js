define(["app",
    "assets/js/common/notification"
  ],
  function(Landerds, Notification) {
    var DeployedDomainsBaseView = Marionette.ItemView.extend({

      updateLoadTime: function(e) {
        if (e) e.preventDefault();

        var urlEndpointIdToUpdateTo = this.$el.find(".lander-links-select option:selected").val();
        this.updateLoadTimeDisplay(urlEndpointIdToUpdateTo);
      },

      selectCampaignTab: function(e) {
        e.preventDefault();
        this.trigger("selectCampaignTab");
      },

      onDestroy: function() {
        this.trigger("updateParentLayout", this.model);
      },

      updateLoadTimeDisplay: function(url_endpoint_id) {

        //use endpoint id to get the correct load time to show

        var loadTimesArr = this.model.get("endpoint_load_times");

        // search load times for this endpoint id, when find it assign load time, else show "N/A"
        var loadTime;
        var loading;
        $.each(loadTimesArr, function(idx, loadTimeObj) {
          if (loadTimeObj.url_endpoint_id == url_endpoint_id) {
            loadTime = loadTimeObj.load_time;
            loading = loadTimeObj.loading || false;
          }
        });

        if (loading) {
          this.model.set("load_time_spinner_gui", true);
        } else {
          this.model.set("load_time_spinner_gui", false);
        }

        if (loadTime) {
          var seconds = (parseInt(loadTime) / 1000).toFixed(2);
          var text = seconds + " sec";
          this.$el.find(".load-time-display").text(text);
        } else {
          this.$el.find(".load-time-display").text("N/A");
        }
      },

      setLoadTimeSpinnerState: function() {
        if (this.model.get("load_time_spinner_gui")) {
          this.$el.find(".get-load-time span").addClass("glyphicon-refresh-animate")
        } else {
          this.$el.find(".get-load-time span").removeClass("glyphicon-refresh-animate")
        }
      },

      getLoadTime: function(e) {
        e.preventDefault();
        //get the load time for the current endpoint
        var currentLink = this.getCurrentLink();
        var loadTimesArr = this.model.get("endpoint_load_times");
        var shouldGetLoadTime = true;
        //if already loading don't send another request to get load time
        $.each(loadTimesArr, function(idx, loadTimeObj) {
          if (loadTimeObj.url_endpoint_id == currentLink.url_endpoint_id) {
            if (loadTimeObj.loading) {
              shouldGetLoadTime = false;
            }
          }
        });

        if (shouldGetLoadTime) {
          this.trigger("getLoadTime", currentLink);
        }
      },

      copyLinkToClipboard: function(text) {

        var textArea = $("<textarea></textarea>");

        // Place in top-left corner of screen regardless of scroll position.
        textArea.css("position", "fixed");
        textArea.css("top", "0");
        textArea.css("left", "0");

        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textArea.css("width", "2em");
        textArea.css("height", "2em");

        // We don't need padding, reducing the size if it does flash render.
        textArea.css("padding", "0");

        // Clean up any borders.
        textArea.css("border", "none");
        textArea.css("outline", "none");
        textArea.css("boxShadow", "none");

        // Avoid flash of white box if rendered for any reason.
        textArea.css("background", "transparent");
        textArea.text(text);

        $("body").append(textArea);

        textArea.select();

        try {
          var successful = document.execCommand('copy');
        } catch (err) {}

        textArea.remove();

        Notification("", "Successfully Copied Lander Link", "success", "stack_top_right");


        return false;
      },

      getCurrentLink: function() {
        //return the combination of selects
        var endpointFilename = this.$el.find(".lander-links-select option:selected").attr("data-filename");
        var endpointId = this.$el.find(".lander-links-select option:selected").val();

        return { link: "http://" + this.model.get("domain") + "/" + this.model.get("deployment_folder_name") + "/" + endpointFilename, url_endpoint_id: endpointId }
      },

      openLanderLink: function() {
        window.open(this.getCurrentLink().link, '_blank');
        return false;
      },

      baseClassOnRender: function() {
        this.$el.find(".lander-links-select").select2();

        var currentShowingEndpointId = this.$el.find(".lander-links-select option:first").val();
        this.updateLoadTimeDisplay(currentShowingEndpointId);


        var deployStatus = this.model.get("deploy_status");
        this.$el.removeClass("success alert warning");
        if (deployStatus === "deployed") {
          this.$el.addClass("success");
        } else if (deployStatus === "deploying" ||
          deployStatus === "undeploying" ||
          deployStatus === "invalidating_delete" ||
          deployStatus === "invalidating" ||
          deployStatus === "redeploying" ||
          deployStatus === "optimizing") {
          this.$el.addClass("alert");
        }

        //never show modified in deployed row ! only for right sidebar
        // if (this.model.get("modified") && (this.model.get("deploy_status") != "deploying" && 
        //   this.model.get("deploy_status") != "undeploying")) {
        //   this.$el.removeClass("success alert warning");
        //   this.$el.addClass("warning");
        // }

        this.trigger("updateParentLayout", this.model);
      }

    });
    return DeployedDomainsBaseView;
  });
