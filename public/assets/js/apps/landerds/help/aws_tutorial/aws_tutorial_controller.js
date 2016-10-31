define(["app",
    "assets/js/apps/landerds/help/aws_tutorial/views/aws_tutorial_layout_view",
    "assets/js/apps/landerds/help/aws_tutorial/views/loading_view",
    "assets/js/apps/landerds/help/aws_tutorial/views/aws_tutorial_list_view",
    "assets/js/apps/landerds/help/aws_tutorial/dao/aws_model"
  ],
  function(Landerds, AwsTutorialLayoutView, LoadingView, AwsTutorialListView, AwsModel) {
    Landerds.module("HelpApp.AwsTutorial", function(AwsTutorial, Landerds, Backbone, Marionette, $, _) {

      AwsTutorial.Controller = {

        showAwsTutorial: function() {
          var awsModel = new AwsModel;
          var awsTutorialLayoutView = new AwsTutorialLayoutView({
            model: awsModel
          });


          Landerds.rootRegion.currentView.modalRegion.show(awsTutorialLayoutView);


          var loadingView = new LoadingView();
          awsTutorialLayoutView.awsSettingsRegion.show(loadingView);

          //settings get the login model which is like all the stuff for the user or whatever..
          awsModel.fetch({
            success: function(model) {

              var awsTutorialView = new AwsTutorialListView({
                model: model
              });

              awsTutorialLayoutView.on("confirmUpdateAwsAccessKeys", function(accessKeyData) {
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

                      awsTutorialLayoutView.onClose();
                    }

                  },
                  error: function() {}
                });

              });

              if (awsTutorialLayoutView.isRendered) {
                awsTutorialLayoutView.awsSettingsRegion.show(awsTutorialView);
              }

            },
            error: function(one, two, three) {
              Landerds.execute("show:login");
            }
          });
        }
      }
    });

    return Landerds.HelpApp.AwsTutorial.Controller;
  });
