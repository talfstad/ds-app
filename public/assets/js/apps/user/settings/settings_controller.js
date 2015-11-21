define(["app",
    "/assets/js/apps/user/settings/views/settings_layout_view.js",
    "/assets/js/apps/user/settings/dao/aws_model.js"
  ],
  function(Moonlander, SettingsLayoutView, AwsModel) {
    Moonlander.module("UserApp.Settings", function(Settings, Moonlander, Backbone, Marionette, $, _) {

      Settings.Controller = {

        showSettingsModal: function() {
          //settings get the login model which is like all the stuff for the user or whatever..
          var awsModel = new AwsModel();
          awsModel.fetch({
            success: function() {
              var settingsLayoutView = new SettingsLayoutView({
                model: awsModel
              });


              settingsLayoutView.render();

              Moonlander.rootRegion.currentView.modalRegion.show(settingsLayoutView);

            }
          });
        }

      }
    });

    return Moonlander.UserApp.Settings.Controller;
  });
