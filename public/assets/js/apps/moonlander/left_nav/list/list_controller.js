define(["app", 
        "/assets/js/apps/moonlander/left_nav/list/list_view.js",
        "/assets/js/apps/moonlander/entry_point/entry_app.js"], 
function(Moonlander, LeftNavView){
  Moonlander.module("LeftNavApp", function(LeftNavApp, Moonlander, Backbone, Marionette, $, _){
    LeftNavApp.Controller = {
      
      showLeftNav: function(){
        
        var leftNavView = new LeftNavView();

        
        leftNavView.on("childview:navigate", function(childView, model, child) {
          if(child){
            children = model.get("children");
            var childModel = children[child];
            RipManager.trigger(childModel.navigationTrigger);
          } else {
            // var trigger = model.get("navigationTrigger");
            var url = model.get("url");
            me.setActiveLeftNav(url);
            RipManager.navigate(url, {trigger: true});
          }
        });

        //show it here TODO
        Moonlander.rootRegion.currentView.leftNavRegion.show(leftNavView);
      
      }

      
      // setActiveLeftNav: function(url){
      //   var links = RipManager.request("leftNav:links"); // get collection for links
        
      //   //iterate through all links turn
      //   links.each(function(link){
      //     if(link.get("url") === url) {
      //       link.attributes.active = true;
      //     } else {
      //       link.attributes.active = false;
      //     }
      //   });
      //   links.trigger("reset");
      //   // this.leftNavView.onDomRefresh();
      // }
    };
 
  });

  return Moonlander.LeftNavApp.Controller;
});