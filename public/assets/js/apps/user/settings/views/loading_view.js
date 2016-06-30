define(["app",
    "tpl!assets/js/apps/user/settings/templates/loading.tpl"
  ],
  function(Landerds, LoadingTpl) {

    Landerds.module("UserApp.Settings", function(Settings, Landerds, Backbone, Marionette, $, _) {
      Settings.LoadingView = Marionette.ItemView.extend({

        template: LoadingTpl,

        onRender: function() {

        }

      });
    });
    return Landerds.UserApp.Settings.LoadingView;
  });