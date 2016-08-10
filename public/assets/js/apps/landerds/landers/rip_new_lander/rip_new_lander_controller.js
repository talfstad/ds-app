define(["app",
    "assets/js/apps/landerds/landers/rip_new_lander/views/rip_new_lander_layout_view",
    "assets/js/apps/landerds/landers/dao/lander_model"
  ],
  function(Landerds, RipNewLanderLayoutView, LanderModel) {
    Landerds.module("LandersApp.Landers.RipNewLander", function(RipNewLander, Landerds, Backbone, Marionette, $, _) {

      RipNewLander.Controller = {

        showRipNewLanderModal: function() {

          var landerModel = new LanderModel({
            source: "rip"
          });

          var ripNewLanderLayout = new RipNewLanderLayoutView({
            model: landerModel
          });

          ripNewLanderLayout.on("ripLanderConfirmed", function() {

            landerModel.set("alertLoading", true);

            landerModel.save({}, {
              success: function(savedLanderModel) {
                var error = savedLanderModel.get("error");
                if (error) {

                  landerModel.set({
                    alertInvalidInputs: true,
                    alertLoading: false
                  });

                  savedLanderModel.unset("error");
                } else {
                  //add the new url endpoints
                  var endpointsArr = savedLanderModel.get("url_endpoints_arr");
                  landerModel.get("urlEndpoints").add(endpointsArr);

                  ripNewLanderLayout.closeModal();

                  landerModel.set({
                    deployment_folder_name: savedLanderModel.get("s3_folder_name"),
                    alertLoading: false
                  });

                  Landerds.trigger("landers:list:addLander", landerModel);

                }



              },
              error: function() {

              }

            })


          });


          ripNewLanderLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(ripNewLanderLayout);

        }

      }
    });

    return Landerds.LandersApp.Landers.RipNewLander.Controller;
  });
