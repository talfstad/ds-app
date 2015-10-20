define(["app",
        "/assets/js/apps/moonlander/domains/dao/domain_collection.js"], 
function(Moonlander, DomainCollection){
var LanderModel = Backbone.Model.extend({
  urlRoot: "/api/landers",

  //initialize the collection for deployed locations
  initialize: function(){
    var deployedLocations = this.get("deployedLocations");
    this.deployedLocations = new DomainCollection(deployedLocations);

    //register model with updater because its possible for this to be
    //live updated. this makes sure that on load if something is in
    //process of updating that we register it and check for status
    //updates
    Moonlander.updater.register(this);
  },

  defaults: {
    name: "",
    last_updated: "",
    optimize_js: false,
    optimize_css: false,
    optimize_images: false,
    optimize_gzip: false,

    //gui update attributes
    deployed_status: 'deployed'
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