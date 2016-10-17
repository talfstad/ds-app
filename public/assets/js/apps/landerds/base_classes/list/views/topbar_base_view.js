define(["app"],
  function(Landerds) {
    var TopbarBaseView = Marionette.ItemView.extend({

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
        var totalText = this.baseTitle;
        if (total > 1 || total < 1) {
          totalText += "s";
        }
        var totalEl = this.$el.find(".total-badge");
        var totalTextEl = this.$el.find(".total-text");
        totalEl.text(total);
        totalTextEl.text(totalText);
      },

      updateTotalWorkingValue: function() {
        var total_working = parseInt(this.model.get("total_undeploying")) + parseInt(this.model.get("total_deploying"));
        var totalText = this.baseTitle;
        if (total_working > 1 || total_working < 1) {
          totalText += "s";
        }
        var totalWorkingEl = this.$el.find(".total-working-badge");
        var totalWorkingTextEl = this.$el.find(".total-working-text");
        totalWorkingEl.text(total_working);
        totalWorkingTextEl.text(totalText);

        var container = this.$el.find(".total-working")
        if (total_working > 0) {
          container.show();
        } else {
          container.hide();
        }
      },

      updateTotalModifiedValue: function() {
        var total_modified = this.model.get("total_modified")
        var totalText = this.baseTitle;
        if (total_modified > 1 || total_modified < 1) {
          totalText += "s";
        }
        var totalModifiedEl = this.$el.find(".total-modified-badge");
        var totalModifiedText = this.$el.find(".total-modified-text");
        totalModifiedEl.text(total_modified);
        totalModifiedText.text(totalText);

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
        this.updateTotalValue();
        this.updateShowingTotalValue();
        this.updateShowingHighValue();
        this.updateShowingLowValue();
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
        checkedLabelEl.css("display", "inline");
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
      }

    });

    return TopbarBaseView;
  });
