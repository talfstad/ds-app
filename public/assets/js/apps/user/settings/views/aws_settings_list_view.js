define(["app",
    "tpl!assets/js/apps/user/settings/templates/aws_settings_list.tpl",
    "bootstrap.datatables"
  ],
  function(Moonlander, SettingsListTpl) {

    Moonlander.module("UserApp.Settings", function(Settings, Moonlander, Backbone, Marionette, $, _) {
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
    return Moonlander.UserApp.Settings.View;
  });
