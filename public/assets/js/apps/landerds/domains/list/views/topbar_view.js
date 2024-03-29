define(["app",
    "tpl!assets/js/apps/landerds/domains/list/templates/topbar.tpl",
    "assets/js/apps/landerds/base_classes/list/views/topbar_base_view"
  ],
  function(Landerds, topbarTpl, TopbarBaseView) {

    Landerds.module("DomainsApp.Domains.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.TopbarView = TopbarBaseView.extend({

        template: topbarTpl,

        baseTitle: "Domain",

        events: {
          "mouseover .filter-domains": "mouseinFilter",
          "mouseout .filter-domains": "mouseoutFilter",
          "click .working-checkbox-label": "clickFilterLabelInput",
          "change #filter-working-checkbox": "filterWorkingInput"
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

        onRender: function() {
          this.updateAllGuiValues();
        }

      });

    });
    return Landerds.DomainsApp.Domains.List.TopbarView;
  });
