define(["app",
    "tpl!assets/js/apps/moonlander/landers/list/templates/landers_empty_items.tpl"
  ],
 function(Moonlander, landersListEmptyItemsTpl) {

  Moonlander.module("LandersApp.Landers.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.EmptyView = Marionette.ItemView.extend({

      template: landersListEmptyItemsTpl,

      onBeforeRender: function(){
      	this.model.set('filterVal',$('.lander-search').val());
	  }

    });
  });
  return Moonlander.LandersApp.Landers.List.EmptyView;
});
