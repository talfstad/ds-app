define(["app",
    "tpl!assets/js/apps/landerds/landers/report_broken/templates/report_broken_layout.tpl",
    "syphon"
  ],
  function(Landerds, ReportBrokenLayoutTpl) {

    Landerds.module("LandersApp.Landers.ReportBroken", function(ReportBroken, Landerds, Backbone, Marionette, $, _) {

      ReportBroken.Layout = Marionette.LayoutView.extend({

        id: "report-broken-lander-modal",

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: ReportBrokenLayoutTpl,

        regions: {

        },

        events: {
          "click .report-broken-confirm": "confirmedReportBroken",
          "keyup input": "ifEnterSubmit"
        },

        modelEvents: {

        },

        ifEnterSubmit: function(e) {
          if (e.keyCode == 13) {
            this.$el.find("button[type='submit']").click();
          }
        },

        confirmedReportBroken: function(e) {
          e.preventDefault();
          this.trigger("reportBrokenConfirmed");
          this.$el.modal('hide');
        },

        onRender: function() {
          var me = this;
          this.$el.off('show.bs.modal');
          this.$el.off('shown.bs.modal');

          this.$el.modal('show');
        }

      });
    });
    return Landerds.LandersApp.Landers.ReportBroken.Layout;
  });
