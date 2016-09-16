define(["app",
    "tpl!assets/js/apps/landerds/landers/list/templates/add_new_group.tpl"
  ],
  function(Landerds, AddNewGroupTpl) {

    Landerds.module("LandersApp.Landers.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.AddNewGroup = Marionette.ItemView.extend({

        template: AddNewGroupTpl,

        modelEvents: {
          'change': 'render'
        },

        className: "bs-component btn-group ml15",

        onBeforeRender: function() {

        }

      });
    });
    return Landerds.LandersApp.Landers.List.AddNewGroup;
  });