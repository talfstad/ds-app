define(["app",
    "/assets/js/apps/moonlander/landers/duplicate_lander/views/duplicate_lander_layout_view.js",
    "/assets/js/apps/moonlander/landers/dao/lander_model.js"
  ],
  function(Moonlander, DuplicateLanderLayoutView, LanderModel) {
    Moonlander.module("LandersApp.Landers.DuplicateLander", function(DuplicateLander, Moonlander, Backbone, Marionette, $, _) {

      DuplicateLander.Controller = {

        showDuplicateLander: function(landerModelToDuplicate) {
          //take the lander model to dup and put it in a state to be re-initialized empty. setting attributes and
          //not using .set doesnt trigger a render of the right sidebar even though its changing.. kind of a hack        
          landerModelToDuplicate.attributes.deployedLocations = [];
          landerModelToDuplicate.attributes.activeCampaigns = [];
          landerModelToDuplicate.attributes.activeJobs = [];
          landerModelToDuplicate.attributes.active_campaigns_count = 0;
          landerModelToDuplicate.attributes.urlEndpoints = landerModelToDuplicate.get("urlEndpoints").toJSON();

          $.each(landerModelToDuplicate.attributes.urlEndpoints, function(idx, endpoint) {
            endpoint.activeSnippets = []; //no active snippets carried over
          });

          var duplicatedLanderModel = new LanderModel(landerModelToDuplicate.attributes)
          delete duplicatedLanderModel.attributes.id;


          var duplicateLanderLayout = new DuplicateLanderLayoutView({
            model: duplicatedLanderModel
          });

          duplicateLanderLayout.on("duplicateLander", function(newLanderName) {
            var me = this;

            this.model.set("name", newLanderName);

            //1. save the lander as a new lander
            this.model.save({}, {
              success: function(landerModel, two, three) {
                Moonlander.trigger("landers:list:addNewDuplicatedLander", landerModel);

              },
              error: function() {

              }
            })

          });


          duplicateLanderLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(duplicateLanderLayout);

        }

      }
    });

    return Moonlander.LandersApp.Landers.DuplicateLander.Controller;
  });
