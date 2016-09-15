define(["app"], 
function(Landerds){
  var GroupsModel = Backbone.Model.extend({
  	urlRoot: '/api/groups',
    defaults: {
    }
  });

  return GroupsModel;

});