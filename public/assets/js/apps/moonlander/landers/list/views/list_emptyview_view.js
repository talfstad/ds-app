define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/templates/landers_empty_items.tpl"
  ],
 function(Moonlander, landersListEmptyItemsTpl) {

  Moonlander.module("LandersApp.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.emptyView = Marionette.ItemView.extend({

      template: landersListEmptyItemsTpl,

      onBeforeRender: function(){
      	this.model.set('filterVal',$('.lander-search').val());
	  }

    });
  });
  return Moonlander.LandersApp.List.emptyView;
});
