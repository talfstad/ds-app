define(["app",
        "/assets/js/apps/moonlander/landers/dao/deployed_locations_collection.js"], 
function(Moonlander, DeployedLocationsCollection){
var LanderModel = Backbone.Model.extend({
  urlRoot: "/api/lander",

  //initialize the collection for deployed locations
  initialize: function(){
    var deployedLocations = this.get("deployedLocations");
    this.deployedLocations = new DeployedLocationsCollection(deployedLocations);
  },

  defaults: {
    name: "",
    optimizations: {}
  },

  validation: {
      username: {
        required: true,
        msg: "is Required"
      },
      password: {
        required: true,
        msg: "is Required"
      }
    }
    
  });
  return LanderModel;
});