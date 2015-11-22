define(["app",
    "/assets/js/apps/user/settings/views/settings_layout_view.js",
    "/assets/js/apps/user/settings/views/loading_view.js",
    "/assets/js/apps/user/settings/views/aws_settings_list_view.js",
    "/assets/js/apps/user/settings/dao/aws_model.js"
  ],
  function(Moonlander, SettingsLayoutView, LoadingView, AwsSettingsListView, AwsModel) {
    Moonlander.module("UserApp.Settings", function(Settings, Moonlander, Backbone, Marionette, $, _) {

      Settings.Controller = {

        showSettingsModal: function() {

          var settingsLayoutView = new SettingsLayoutView({
                model: awsModel
              });


          settingsLayoutView.render();
          
          Moonlander.rootRegion.currentView.modalRegion.show(settingsLayoutView);


          var loadingView = new LoadingView();
          settingsLayoutView.awsSettingsRegion.show(loadingView)
      
          //settings get the login model which is like all the stuff for the user or whatever..
          var awsModel = new AwsModel();
          awsModel.fetch({
            success: function(model) {
              
              var awsSettingsView = new AwsSettingsListView({
                model: model
              });

              settingsLayoutView.awsSettingsRegion.show(awsSettingsView);

            }
          });
        }

      }
    });

    return Moonlander.UserApp.Settings.Controller;
  });
