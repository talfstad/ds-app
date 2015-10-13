define(["app"], 
function(Moonlander){
  var DomainModel = Backbone.Model.extend({
  	urlRoot: '/api/domains',
    defaults: {
      domain: "",
      urlEndpoints: []
    }
    
  });

  return DomainModel;

});