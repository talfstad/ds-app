define(["app"], 
function(Landerds){
  var GroupModel = Backbone.Model.extend({
  	urlRoot: '/api/groups',
    defaults: {
    }
  });

  return GroupModel;

});