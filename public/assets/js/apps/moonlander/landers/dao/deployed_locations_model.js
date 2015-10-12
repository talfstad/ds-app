define(["app"], 
function(Moonlander){
  var DeployedLocationsModel = Backbone.Model.extend({

    defaults: {
      name: ""
    }
    
  });

  return DeployedLocationsModel;

});