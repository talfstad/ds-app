define(["app",
    "tpl!assets/js/apps/landerds/landers/list/templates/topbar.tpl"
  ],
  function(Landerds, topbarTpl) {

    Landerds.module("LandersApp.Landers.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.TopbarView = Marionette.ItemView.extend({

        template: topbarTpl,

        events: {
          "mouseover .filter-landers": "mouseinFilter",
          "mouseout .filter-landers": "mouseoutFilter",
          "click .working-checkbox-label": "clickFilterLabelInput",
          "change #filter-working-checkbox": "filterWorkingInput",
          "click .modified-checkbox-label": "clickFilterLabelInput",
          "change #filter-modified-checkbox": "filterModifiedInput",
          "click .deleting-checkbox-label": "clickFilterLabelInput",
          "change #filter-deleting-checkbox": "filterDeletingInput"
        },

        modelEvents: {
          "change:showing_low": "updateShowingLowValue",
          "change:showing_high": "updateShowingHighValue",
          "change:showing_total": "updateShowingTotalValue",
          "change:total": "updateTotalValue",
          "change:total_deleting": "updateTotalDeletingValue",
          "change:total_modified": "updateTotalModifiedValue",
          "change:total_deploying": "updateTotalWorkingValue",
          "change:total_undeploying": "updateTotalWorkingValue"
        },

        updateShowingLowValue: function() {
          var showing_low = this.$el.find(".showing-low");
          showing_low.text(this.model.get("showing_low"));
        },

        updateShowingHighValue: function() {
          var showing_high = this.$el.find(".showing-high");
          showing_high.text(this.model.get("showing_high"));
        },

        updateShowingTotalValue: function() {
          var showing_total = this.$el.find(".showing-total");
          showing_total.text(this.model.get("total_num_items"));
        },

        updateTotalValue: function() {
          var total = this.model.get("total");
          var totalLander = "Lander"
          if (total > 1 || total < 1) {
            totalLander = "Landers"
          }
          var totalEl = this.$el.find(".total-landers-badge");
          var totalTextEl = this.$el.find(".total-lander-text");
          totalEl.text(total);
          totalTextEl.text(totalLander);
        },

        updateTotalDeletingValue: function() {
          var total_deleting = this.model.get("total_deleting");
          var deletingLanderText = "Lander";
          if (total_deleting > 1 || total_deleting < 1) {
            deletingLanderText = "Landers";
          }
          var totalDeletingEl = this.$el.find(".total-deleting-badge");
          var totalDeletingTextEl = this.$el.find(".total-deleting-text");
          totalDeletingEl.text(total_deleting);
          totalDeletingTextEl.text(deletingLanderText);

          var container = this.$el.find(".total-deleting")
          if (total_deleting > 0) {
            container.show();
          } else {
            container.hide();
          }
        },

        updateTotalWorkingValue: function() {
          var total_working = parseInt(this.model.get("total_undeploying")) + parseInt(this.model.get("total_deploying"));
          var totalWorkingLander = "Lander";
          if (total_working > 1 || total_working < 1) {
            totalWorkingLander = "Landers";
          }
          var totalWorkingEl = this.$el.find(".total-working-badge");
          var totalWorkingTextEl = this.$el.find(".total-working-text");
          totalWorkingEl.text(total_working);
          totalWorkingTextEl.text(totalWorkingLander);

          var container = this.$el.find(".total-working")
          if (total_working > 0) {
            container.show();
          } else {
            container.hide();
          }
        },

        updateTotalModifiedValue: function() {
          var total_modified = this.model.get("total_modified")
          var modifiedLanderText = "Lander";
          if (total_modified > 1 || total_modified < 1) {
            modifiedLanderText = "Landers";
          }
          var totalModifiedEl = this.$el.find(".total-modified-badge");
          var totalModifiedText = this.$el.find(".total-modified-lander-text");
          totalModifiedEl.text(total_modified);
          totalModifiedText.text(modifiedLanderText);

          var container = this.$el.find(".total-modified")
          if (total_modified > 0) {
            container.show();
          } else {
            container.hide();
          }
        },

        updateAllGuiValues: function() {
          this.updateTotalModifiedValue();
          this.updateTotalWorkingValue();
          this.updateTotalDeletingValue();
          this.updateTotalValue();
          this.updateShowingTotalValue();
          this.updateShowingHighValue();
          this.updateShowingLowValue();
        },

        filterWorkingInput: function(e) {
          //now trigger filter if its true
          var currentTarget = $(e.currentTarget);

          if (currentTarget.parent().parent().find("input").is(":checked")) {
            this.trigger("landers:preFilter", "working");
          } else {
            this.trigger("landers:removePreFilter", "working");
          }
        },

        filterModifiedInput: function(e) {
          //now trigger filter if its true
          var currentTarget = $(e.currentTarget);

          if (currentTarget.parent().parent().find("input").is(":checked")) {
            this.trigger("landers:preFilter", "modified");
          } else {
            this.trigger("landers:removePreFilter", "modified");
          }
        },

        filterDeletingInput: function(e) {
          //now trigger filter if its true
          var currentTarget = $(e.currentTarget);

          if (currentTarget.parent().parent().find("input").is(":checked")) {
            this.trigger("landers:preFilter", "modified");
          } else {
            this.trigger("landers:removePreFilter", "deleting");
          }
        },

        clickFilterLabelInput: function(e) {
          var currentTarget = $(e.currentTarget);
          var checkbox = currentTarget.parent().find(":checkbox")
          checkbox.each(function() {
            this.checked = !this.checked;
          });
          checkbox.trigger("change");
        },

        mouseinFilter: function(e) {
          var currentTarget = $(e.currentTarget);
          var checkedLabelEl = currentTarget.find(".checkbox-custom");
          var badge = currentTarget.find(".badge");
          badge.hide();
          checkedLabelEl.css("display","inline");
        },

        mouseoutFilter: function(e) {
          //if not checked show badge
          var currentTarget = $(e.currentTarget);
          var checkedLabelEl = currentTarget.find(".checkbox-custom");
          var checkedInputEl = checkedLabelEl.find("input");
          if (!checkedInputEl.is(':checked')) {
            var badge = currentTarget.find(".badge");
            checkedLabelEl.hide();
            badge.show();
          }
        },

        onBeforeRender: function() {
          this.model.set("filterWorking", false);
        },

        onRender: function() {
          this.updateAllGuiValues();
        }

      });

    });
    return Landerds.LandersApp.Landers.List.TopbarView;
  });
