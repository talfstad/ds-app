define(["app",
    "/assets/js/apps/moonlander/landers/duplicate_lander/views/duplicate_lander_layout_view.js",
    "/assets/js/apps/moonlander/landers/dao/lander_model.js"
  ],
  function(Moonlander, DuplicateLanderLayoutView, LanderModel) {
    Moonlander.module("LandersApp.Landers.DuplicateLander", function(DuplicateLander, Moonlander, Backbone, Marionette, $, _) {

      DuplicateLander.Controller = {

        showDuplicateLander: function(landerModelToDuplicateAttributes) {
          //take the lander model to dup and put it in a state to be re-initialized empty. setting attributes and
          //not using .set doesnt trigger a render of the right sidebar even though its changing.. kind of a hack        

          var duplicateLanderModelAttr = {
            fromName: landerModelToDuplicateAttributes.name,
            from_s3_folder_name: landerModelToDuplicateAttributes.s3_folder_name,
            source: "copy",
            urlEndpoints: landerModelToDuplicateAttributes.urlEndpointsJSON
          };

          var duplicatedLanderModel = new LanderModel(duplicateLanderModelAttr)

          duplicatedLanderModel.attributes.active_campaigns_count = 0;

          $.each(duplicatedLanderModel.get("urlEndpointsJSON"), function(idx, endpoint) {
            endpoint.activeSnippets = []; //no active snippets carried over
          });

          var duplicateLanderLayout = new DuplicateLanderLayoutView({
            model: duplicatedLanderModel
          });

          duplicateLanderLayout.on("duplicateLanderConfirm", function(newLanderName) {
            var me = this;

            duplicatedLanderModel.set("alertLoading", true);


            this.model.set("name", newLanderName);

            //1. save the lander as a new lander
            this.model.save({}, {
              success: function(landerModel, two, three) {

                duplicatedLanderModel.set("alertLoading", false);
                
                duplicateLanderLayout.closeModal();

                var urlEndpoints = duplicatedLanderModel.get("urlEndpoints");
                urlEndpoints.each(function(endpoint) {
                  var activeSnippets = endpoint.get("activeSnippets");
                  activeSnippets.reset();
                });

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
