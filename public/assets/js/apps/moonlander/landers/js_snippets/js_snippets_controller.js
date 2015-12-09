define(["app",
    "/assets/js/apps/moonlander/landers/js_snippets/views/js_snippets_layout_view.js",
    "/assets/js/apps/moonlander/landers/js_snippets/views/loading_view.js",
  ],
  function(Moonlander, JsSnippetsLayoutView, LoadingView, AwsSettingsListView, AwsModel) {
    Moonlander.module("LandersApp.JsSnippets", function(JsSnippets, Moonlander, Backbone, Marionette, $, _) {

      JsSnippets.Controller = {

        showJsSnippetsModal: function(landerModel) {

          var jsSnippetsLayoutView = new JsSnippetsLayoutView({
            model: landerModel
          });


          jsSnippetsLayoutView.render();

          Moonlander.rootRegion.currentView.modalRegion.show(jsSnippetsLayoutView);


          // var loadingView = new LoadingView();
          // jsSnippetsLayoutView.awsSettingsRegion.show(loadingView)

          // //settings get the login model which is like all the stuff for the user or whatever..
          // var awsModel = new AwsModel();
          // awsModel.fetch({
          //   success: function(model) {

          //     var awsSettingsView = new AwsSettingsListView({
          //       model: model
          //     });

          //     // jsSnippetsLayoutView.awsSettingsRegion.show(awsSettingsView);

          //   }
          // });
        }

      }
    });

    return Moonlander.LandersApp.JsSnippets.Controller;
  });
