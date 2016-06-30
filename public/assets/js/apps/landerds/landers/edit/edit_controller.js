define(["app",
        "assets/js/apps/landerds/landers/edit/views/edit_layout_view"],
function(Landerds, EditLayoutView){
  Landerds.module("LandersApp.Landers.Edit", function(Edit, Landerds, Backbone, Marionette, $, _){

    Edit.Controller = {
      
      showEditLander: function(model){
        
        var editLanderLayout = new EditLayoutView({
          model: model
        });
        editLanderLayout.render();
       
        Landerds.rootRegion.currentView.modalRegion.show(editLanderLayout);
      }

    }
  });

  return Landerds.LandersApp.Landers.Edit.Controller;
});