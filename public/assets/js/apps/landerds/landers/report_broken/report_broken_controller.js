define(["app",
    "assets/js/apps/landerds/landers/report_broken/views/report_broken_layout_view",
    "assets/js/jobs/jobs_model",
  ],
  function(Landerds, ReportBrokenLayout, JobModel) {
    Landerds.module("LandersApp.Landers.ReportBroken", function(ReportBroken, Landerds, Backbone, Marionette, $, _) {

      ReportBroken.Controller = {

        showReportBroken: function(landerModel) {

          var reportBrokenLayout = new ReportBrokenLayout({
            model: landerModel
          });

          reportBrokenLayout.on("reportBrokenConfirmed", function() {
            
            landerModel.set("reported_broken", true);
            landerModel.save({}, {
              success: function() {
                //nothing needed, gui update triggered by reported_broken changing
              }
            });

          });

          reportBrokenLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(reportBrokenLayout);

        }

      }
    });

    return Landerds.LandersApp.Landers.ReportBroken.Controller;
  });
