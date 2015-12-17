define(["app",
    "tpl!/assets/js/apps/moonlander/landers/right_sidebar/templates/name_optimizations.tpl",
    "select2"
  ],
  function(Moonlander, NameOptimizationsTpl) {

    Moonlander.module("LandersApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {
      RightSidebar.NameOptimizationsView = Marionette.ItemView.extend({

        template: NameOptimizationsTpl,

        modelEvents: {
          'change': 'render'
        },

        onBeforeRender: function(){
          //for showing test link
          this.model.set("urlEndpointsJSON", this.model.get("urlEndpoints").toJSON());
        },

        onRender: function(){
          this.$el.find(".test-link-endpoints-select").select2();

          //disable open test link if no endpoints
          if(this.model.get("urlEndpointsJSON").length <= 0){
            this.$el.find(".open-test-link").addClass("disabled");
          }
        }


      });
    });
    return Moonlander.LandersApp.RightSidebar.NameOptimizationsView;
  });