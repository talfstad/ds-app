define(["app",
    "assets/js/apps/landerds/common/notification"
  ],
  function(Landerds, Notification) {
    var RowBaseView = Marionette.ItemView.extend({

      onDestroy: function() {
        this.trigger("updateParentLayout", this.model);
      },

      updateViewIndex: function(e) {
        this.$el.find(".view-index").text(this.model.get("viewIndex"));
      },

      onRender: function() {
       
        var deployStatus = this.model.get("deploy_status");
        this.$el.removeClass("success alert warning");
        if (deployStatus === "deployed") {
          this.$el.addClass("success");
        } else if (deployStatus === "deploying" ||
          deployStatus === "undeploying" ||
          deployStatus === "invalidating_delete" ||
          deployStatus === "invalidating" ||
          deployStatus === "redeploying" ||
          deployStatus === "undeploy_invalidating" ||
          deployStatus === "optimizing") {
          this.$el.addClass("alert");
        }

        this.trigger("updateParentLayout", this.model);
      }

    });
    return RowBaseView;
  });
