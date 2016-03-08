define(["app",
    "tpl!assets/js/apps/user/settings/templates/loading.tpl"
  ],
  function(Moonlander, LoadingTpl) {

    Moonlander.module("UserApp.Settings", function(Settings, Moonlander, Backbone, Marionette, $, _) {
      Settings.LoadingView = Marionette.ItemView.extend({

        template: LoadingTpl,

        onRender: function() {

        }

      });
    });
    return Moonlander.UserApp.Settings.LoadingView;
  });