define(["app",
    "assets/js/apps/user/settings/views/settings_layout_view",
    "assets/js/apps/user/settings/views/loading_view",
    "assets/js/apps/user/settings/views/aws_settings_list_view",
    "assets/js/apps/user/settings/dao/aws_model"
  ],
  function(Moonlander, SettingsLayoutView, LoadingView, AwsSettingsListView, AwsModel) {
    Moonlander.module("UserApp.Settings", function(Settings, Moonlander, Backbone, Marionette, $, _) {

      Settings.Controller = {

        showSettingsModal: function() {
          var awsModel = new AwsModel;
          var settingsLayoutView = new SettingsLayoutView({
            model: awsModel
          });


          settingsLayoutView.render();

          Moonlander.rootRegion.currentView.modalRegion.show(settingsLayoutView);


          var loadingView = new LoadingView();
          settingsLayoutView.awsSettingsRegion.show(loadingView)

          //settings get the login model which is like all the stuff for the user or whatever..
          awsModel.fetch({
            success: function(model) {

              var awsSettingsView = new AwsSettingsListView({
                model: model
              });

              settingsLayoutView.on("confirmUpdateAwsAccessKeys", function(accessKeyData) {
                //show loading
                awsModel.set("alertLoading", true);

                //save user model
                this.model.save(accessKeyData, {
                  success: function(model, serverResponse) {
                    awsModel.set("alertLoading", false);

                    if (serverResponse.error) {

                      if (serverResponse.error.code === "InvalidAccessKeyId") {
                        awsModel.set("alertKeysInvalid", true);
                        awsModel.set("alertKeysAlreadyCurrent", false);
                        awsModel.set("alertUnknownError", false);
                      } else if (serverResponse.error.code === "KeysAlreadyCurrent") {
                        awsModel.set("alertKeysAlreadyCurrent", true);
                        awsModel.set("alertKeysInvalid", false);
                        awsModel.set("alertUnknownError", false);
                      } else {
                        awsModel.set("errorCode", serverResponse.error.code);
                        awsModel.set("alertUnknownError", true);
                        awsModel.set("alertKeysAlreadyCurrent", false);
                        awsModel.set("alertKeysInvalid", false);
                      }

                    } else {
                      awsModel.set("alertUpdatedAwsKeys", true);
                      
                      Moonlander.loginModel.set({
                        accessKeyId: awsModel.get("accessKeyId"),
                        secretAccessKey: awsModel.get("secretAccessKey")
                      });

                    }

                  },
                  error: function() {}
                });

              });

              settingsLayoutView.awsSettingsRegion.show(awsSettingsView);

            },
            error: function(one, two, three) {
              Moonlander.execute("show:login");
            }
          });
        }

      }
    });

    return Moonlander.UserApp.Settings.Controller;
  });
