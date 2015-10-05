define(["app",
        "/assets/js/apps/moonlander/landers/edit/views/edit_layout_view.js"], 
function(Moonlander, EditLayoutView){
  Moonlander.module("LandersApp.Landers.Edit", function(Edit, Moonlander, Backbone, Marionette, $, _){

    Edit.Controller = {
      
      showEditLander: function(model){
        
        var editLanderLayout = new EditLayoutView({
          model: model
        });
        editLanderLayout.render();
       
        Moonlander.rootRegion.currentView.editLanderRegion.show(editLanderLayout);
      }

    }
  });

  return Moonlander.LandersApp.Landers.Edit.Controller;
});