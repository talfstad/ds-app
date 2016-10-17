define(["app",
    "tpl!assets/js/apps/landerds/landers/list/templates/topbar.tpl",
    "assets/js/apps/landerds/base_classes/list/views/topbar_base_view"
  ],
  function(Landerds, topbarTpl, TopbarBaseView) {

    Landerds.module("LandersApp.Landers.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.TopbarView = TopbarBaseView.extend({

        template: topbarTpl,

        baseTitle: "Lander",

        events: {
          "mouseover .filter-landers": "mouseinFilter",
          "mouseout .filter-landers": "mouseoutFilter",
          "click .working-checkbox-label": "clickFilterLabelInput",
          "change #filter-working-checkbox": "filterWorkingInput",
          "click .modified-checkbox-label": "clickFilterLabelInput",
          "change #filter-modified-checkbox": "filterModifiedInput",
        },

        modelEvents: {
          "change:showing_low": "updateShowingLowValue",
          "change:showing_high": "updateShowingHighValue",
          "change:showing_total": "updateShowingTotalValue",
          "change:total": "updateTotalValue",
          "change:total_modified": "updateTotalModifiedValue",
          "change:total_working": "updateTotalWorkingValue"
        },
        
        filterWorkingInput: function(e) {
          //now trigger filter if its true
          var currentTarget = $(e.currentTarget);

          if (currentTarget.parent().parent().find("input").is(":checked")) {
            this.trigger("preFilter", "working");
          } else {
            this.trigger("removePreFilter", "working");
          }
        },

        filterModifiedInput: function(e) {
          //now trigger filter if its true
          var currentTarget = $(e.currentTarget);

          if (currentTarget.parent().parent().find("input").is(":checked")) {
            this.trigger("preFilter", "modified");
          } else {
            this.trigger("removePreFilter", "modified");
          }
        },

        onRender: function() {
          this.updateAllGuiValues();
        }

      });

    });
    return Landerds.LandersApp.Landers.List.TopbarView;
  });
