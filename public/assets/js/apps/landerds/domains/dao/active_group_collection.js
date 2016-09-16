define(["app",
		"assets/js/apps/landerds/domains/dao/active_group_model"], 
function(Landerds, ActiveGroupModel) {
  
  var ActiveGroupCollection = Backbone.Collection.extend({
    model: ActiveGroupModel,
  });


  return ActiveGroupCollection;
});
