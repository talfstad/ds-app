define(["app","tpl!/assets/js/apps/moonlander/left_nav/list/templates/left_nav.tpl"],
        function(Moonlander, leftNavTpl){

  Moonlander.module("LeftNavApp", function(LeftNavApp, Moonlander, Backbone, Marionette, $, _){

    LeftNavApp.LeftNav = Marionette.ItemView.extend({
      template: leftNavTpl,
      id: "sidebar_left",
      tagName: "aside",
      className: "nano nano-light affix",

      events: {
        'click a': "navigate"
      },

      navigate: function(e) {
        
        // this.trigger("navigate", this.model, child);
      }
    });

  });

  return Moonlander.LeftNavApp.LeftNav;
});
