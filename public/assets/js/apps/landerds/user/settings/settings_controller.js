define(["app",
    "assets/js/apps/landerds/user/settings/views/settings_layout_view",
    "assets/js/apps/landerds/user/settings/views/loading_view",
    "assets/js/apps/landerds/user/settings/views/aws_settings_list_view",
    "assets/js/apps/landerds/user/settings/dao/aws_model"
  ],
  function(Landerds, SettingsLayoutView, LoadingView, AwsSettingsListView, AwsModel) {
    Landerds.module("UserApp.Settings", function(Settings, Landerds, Backbone, Marionette, $, _) {

      Settings.Controller = {

        showSettingsModal: function() {
          var awsModel = new AwsModel;
          var settingsLayoutView = new SettingsLayoutView({
            model: awsModel
          });


          settingsLayoutView.render();

          Landerds.rootRegion.currentView.modalRegion.show(settingsLayoutView);


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
                      
                      Landerds.loginModel.set({
                        accessKeyId: awsModel.get("accessKeyId"),
                        secretAccessKey: awsModel.get("secretAccessKey"),
                        aws_root_bucket: serverResponse.aws_root_bucket
                      });

                    }

                  },
                  error: function() {}
                });

              });

              settingsLayoutView.awsSettingsRegion.show(awsSettingsView);

            },
            error: function(one, two, three) {
              Landerds.execute("show:login");
            }
          });
        }

      }
    });

    return Landerds.UserApp.Settings.Controller;
  });
