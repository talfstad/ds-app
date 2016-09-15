define(["app",
    "tpl!assets/js/apps/landerds/landers/list/templates/add_new_group.tpl"
  ],
  function(Landerds, AddNewGroupsTpl) {

    Landerds.module("LandersApp.Landers.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.AddNewGroups = Marionette.ItemView.extend({

        template: AddNewGroupsTpl,

        modelEvents: {
          'change': 'render'
        },

        className: "bs-component btn-group ml15",

        onBeforeRender: function() {

        }

      });
    });
    return Landerds.LandersApp.Landers.List.AddNewGroups;
  });