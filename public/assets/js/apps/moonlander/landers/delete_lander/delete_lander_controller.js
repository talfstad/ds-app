define(["app",
    "/assets/js/apps/moonlander/landers/delete_lander/views/loading_view.js",
    "/assets/js/apps/moonlander/landers/delete_lander/views/delete_lander_layout_view.js",
  ],
  function(Moonlander, LoadingView, DeleteLanderLayoutView) {
    Moonlander.module("LandersApp.Landers.DeleteLander", function(DeleteLander, Moonlander, Backbone, Marionette, $, _) {

      DeleteLander.Controller = {

        showDeleteLanderModal: function(model) {

          var deleteLanderLayout = new DeleteLanderLayoutView({
            model: model
          });


          deleteLanderLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(deleteLanderLayout);
          
          //show loading
          // var loadingView = new LoadingView();
          // deleteLanderLayout.campaignsListRegion.show(loadingView)
        
         
          // var deferredCampaignsCollection = Moonlander.request("campaigns:campaignsCollection");

          // $.when(deferredCampaignsCollection).done(function(campaignsCollection) {

            //filter this collection, take out campaigns that lander is already deployed to
            // var filteredCampaignsCollection = campaignsCollection.filterOutCampaigns(model.get("activeCampaigns"));

            //create the view, pass collection in as a var to be used to dynamically add to DT
            //show dt in view
            // var campaignsListView = new CampaignsListView({
            //   datatablesCollection: filteredCampaignsCollection
            // });


            //show actual view
            // deleteLanderLayout.campaignsListRegion.show(campaignsListView)

          // });

        }



      }
    });

    return Moonlander.LandersApp.Landers.DeleteLander.Controller;
  });
