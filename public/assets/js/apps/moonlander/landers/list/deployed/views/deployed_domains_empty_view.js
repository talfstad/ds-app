define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/deployed/templates/empty.tpl"
  ],
 function(Moonlander, EmptyTpl) {

  Moonlander.module("LandersApp.Landers.List.Deployed", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.EmptyView = Marionette.ItemView.extend({
      template: EmptyTpl,
      tagName: "tr",
      className: "warning",

  
      onRender: function() {
        if(this.model.get("deployStatus") === "initializing") {
          this.$el.removeClass("warning").addClass("primary");
        }

        // this.trigger("updateParentLayout", "not_deployed");
      }

    });
  });
  return Moonlander.LandersApp.Landers.List.Deployed.EmptyView;
});
