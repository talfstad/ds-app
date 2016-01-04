define(["app",
    "tpl!/assets/js/apps/moonlander/landers/right_sidebar/templates/optimizations.tpl",
    "select2",
    "syphon"
  ],
  function(Moonlander, NameOptimizationsTpl) {

    Moonlander.module("LandersApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {
      RightSidebar.NameOptimizationsView = Marionette.ItemView.extend({

        template: NameOptimizationsTpl,

        events: {
          "change #optimization-gzip": "landerIsModified",
          "change #optimization-js": "landerIsModified",
          "change #optimization-css": "landerIsModified",
          "change #optimization-images": "landerIsModified"
        },

        landerIsModified: function() {
          //set new vals to model
          this.model.set(Backbone.Syphon.serialize(this));
          this.trigger("modified");
        }

      });
    });
    return Moonlander.LandersApp.RightSidebar.NameOptimizationsView;
  });
