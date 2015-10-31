define(["app",
        "/assets/js/apps/moonlander/domains/dao/domain_collection.js"], 
function(Moonlander, DomainCollection){
var LanderModel = Backbone.Model.extend({
  urlRoot: "/api/landers",

  defaults: {
    name: "",
    last_updated: "",
    optimize_js: false,
    optimize_css: false,
    optimize_images: false,
    optimize_gzip: false,

    //gui update attributes
    deploy_status: 'deployed'
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