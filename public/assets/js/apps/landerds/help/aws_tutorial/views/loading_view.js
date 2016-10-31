define(["app",
    "tpl!assets/js/apps/landerds/help/aws_tutorial/templates/loading.tpl"
  ],
  function(Landerds, LoadingTpl) {

    Landerds.module("HelpApp.AwsTutorial", function(AwsTutorial, Landerds, Backbone, Marionette, $, _) {
      AwsTutorial.LoadingView = Marionette.ItemView.extend({

        template: LoadingTpl,

        onRender: function() {

        }

      });
    });
    return Landerds.HelpApp.AwsTutorial.LoadingView;
  });