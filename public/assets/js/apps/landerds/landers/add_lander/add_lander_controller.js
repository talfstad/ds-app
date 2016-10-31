define(["app",
    "assets/js/apps/landerds/landers/add_lander/views/add_lander_layout_view",
    "assets/js/apps/landerds/landers/add_lander/cancel_add_lander/cancel_add_lander_controller",
    "assets/js/apps/landerds/jobs/jobs_model"
  ],
  function(Landerds, AddNewLanderLayoutView, CancelAddLanderController, JobModel) {
    Landerds.module("LandersApp.Landers.AddNewLander", function(AddNewLander, Landerds, Backbone, Marionette, $, _) {

      AddNewLander.Controller = {

        showCancelAddLander: function(model) {
          CancelAddLanderController.showCancelAddLander(model);
        },

        showAddNewLanderModal: function() {

          var newModel = new JobModel({
            action: "addLander",
            deploy_status: "initializing:add"
          });

          var addNewLanderLayout = new AddNewLanderLayoutView({
            model: newModel
          });

          addNewLanderLayout.on("showAddLanderHelp", function() {
            Landerds.trigger("landers:showAddLanderHelp");
            addNewLanderLayout.close();
          });

          addNewLanderLayout.on("addLanderConfirmed", function() {


            newModel.set("alertLoading", true);

            //start the upload
            addNewLanderLayout.startUpload();

          });

          addNewLanderLayout.on("fileUploadComplete", function(landerUploadedData) {
            var response = landerUploadedData.response;

            var error = response.error;
            if (error) {
              newModel.set({
                alertInvalidInputs: true,
                alertLoading: false
              });
            } else {
              newModel.set({
                id: response.id,
                lander_id: response.lander_id,
                lander_created_on: response.lander_created_on
              });
              //has lander_id in it
              addNewLanderLayout.closeModal();
              Landerds.trigger("landers:list:createLanderFromJobAddToCollection", newModel);
            }
          });


          addNewLanderLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(addNewLanderLayout);

        }

      }
    });

    return Landerds.LandersApp.Landers.AddNewLander.Controller;
  });
