define(["app",
    "assets/js/apps/landerds/landers/add_new_lander/views/add_new_lander_layout_view",
    "assets/js/jobs/jobs_model",
    "assets/js/apps/landerds/landers/dao/lander_model"
  ],
  function(Landerds, AddNewLanderLayoutView, JobModel, LanderModel) {
    Landerds.module("LandersApp.Landers.AddNewLander", function(AddNewLander, Landerds, Backbone, Marionette, $, _) {

      AddNewLander.Controller = {

        showAddNewLanderModal: function() {

          //make new lander model for it
          var landerModel = new LanderModel({
            source: 'add'
          });

          var addNewLanderLayout = new AddNewLanderLayoutView({
            model: landerModel
          });

          addNewLanderLayout.on("fileUploadComplete", function(data) {
            
            //need to populate the landerModel with s3_folder_name/created_on
            // landerModel.set({
            //   s3_folder_name: data.s3_folder_name,
            //   created_on: data.created_on
            // });

            Landerds.trigger("landers:list:addLander", landerModel);
            addNewLanderLayout.onClose();

          });


          addNewLanderLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(addNewLanderLayout);

        }

      }
    });

    return Landerds.LandersApp.Landers.AddNewLander.Controller;
  });
