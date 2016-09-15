define(["app",
		"assets/js/apps/landerds/domains/dao/active_group_model"], 
function(Landerds, ActiveGroupsModel) {
  
  var ActiveGroupsCollection = Backbone.Collection.extend({
    model: ActiveGroupsModel,
  });


  return ActiveGroupsCollection;
});
