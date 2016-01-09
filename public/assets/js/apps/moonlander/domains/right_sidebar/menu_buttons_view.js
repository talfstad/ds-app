define(["app",
    "tpl!/assets/js/apps/moonlander/domains/right_sidebar/templates/menu_buttons.tpl"
  ],
  function(Moonlander, MenuButtonsTpl) {

    Moonlander.module("DomainsApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {
      RightSidebar.MenuButtonsView = Marionette.ItemView.extend({

        template: MenuButtonsTpl,

        className: "btn-group",

        events: {
          'click .redeploy-all-locations': "redeploy"
        },

        redeploy: function(e) {
          var me = this;
          e.preventDefault();

          
          var deployedLocationCollection = me.model.get("deployedLocations");
          deployedLocationCollection.each(function(location) {
            location.set("shouldSetModifiedWhenJobsFinish", false);
          });

          var attr = {
            landersArray: [this.model],
            successCallback: function() {
              me.model.set("modified", false);
              me.model.save({});
            }
          }

          Moonlander.trigger("domains:redeploy", attr);
        },

        modelEvents: {
          'change:deploy_status': 'render'
        }


      });
    });
    return Moonlander.DomainsApp.RightSidebar.MenuButtonsView;
  });
