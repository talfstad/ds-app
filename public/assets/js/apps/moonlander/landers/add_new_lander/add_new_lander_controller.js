define(["app",
    "/assets/js/apps/moonlander/landers/add_new_lander/views/add_new_lander_layout_view.js",
    "/assets/js/jobs/jobs_model.js"
  ],
  function(Moonlander, AddNewLanderLayoutView, JobModel) {
    Moonlander.module("LandersApp.Landers.AddNewLander", function(AddNewLander, Moonlander, Backbone, Marionette, $, _) {

      AddNewLander.Controller = {

        showAddNewLander: function() {

          //make new lander model for it
          var jobModel = new JobModel({
            action: "addNewLander"
          });

          var addNewLanderLayout = new AddNewLanderLayoutView({
            model: jobModel
          });


          addNewLanderLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(addNewLanderLayout);
        
        }

      }
    });

    return Moonlander.LandersApp.Landers.AddNewLander.Controller;
  });