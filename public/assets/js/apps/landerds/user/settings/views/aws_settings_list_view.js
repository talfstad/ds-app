define(["app",
    "tpl!assets/js/apps/landerds/user/settings/templates/aws_settings_list.tpl",
    "bootstrap.datatables"
  ],
  function(Landerds, SettingsListTpl) {

    Landerds.module("UserApp.Settings", function(Settings, Landerds, Backbone, Marionette, $, _) {
      Settings.View = Marionette.ItemView.extend({

        template: SettingsListTpl,

        initialize: function() {
       
        },

        //onRender builds the datatable object with our collection
        onRender: function() {
          var me = this;
   


        }

      });
    });
    return Landerds.UserApp.Settings.View;
  });
