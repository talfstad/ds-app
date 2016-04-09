define(["app",
    "/assets/js/apps/moonlander/landers/rip_new_lander/views/rip_new_lander_layout_view.js",
    "/assets/js/apps/moonlander/landers/dao/lander_model.js"
  ],
  function(Moonlander, RipNewLanderLayoutView, LanderModel) {
    Moonlander.module("LandersApp.Landers.RipNewLander", function(RipNewLander, Moonlander, Backbone, Marionette, $, _) {

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
              success: function() {
                landerModel.set("alertLoading", false);
                ripNewLanderLayout.closeModal();
                Moonlander.trigger("landers:list:addLander", landerModel);
              },
              error: function() {

              }

            })


          });


          ripNewLanderLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(ripNewLanderLayout);

        }

      }
    });

    return Moonlander.LandersApp.Landers.RipNewLander.Controller;
  });
