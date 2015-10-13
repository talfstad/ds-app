define(["app",
        "/assets/js/apps/moonlander/domains/dao/domain_collection.js"], 
function(Moonlander, DomainCollection){
var LanderModel = Backbone.Model.extend({
  urlRoot: "/api/landers",

  //initialize the collection for deployed locations
  initialize: function(){
    var deployedLocations = this.get("deployedLocations");
    this.deployedLocations = new DomainCollection(deployedLocations);
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