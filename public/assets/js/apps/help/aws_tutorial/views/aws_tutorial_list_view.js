define(["app",
    "tpl!assets/js/apps/help/aws_tutorial/templates/aws_tutorial_list.tpl",
    "bootstrap.datatables"
  ],
  function(Landerds, SettingsListTpl) {

    Landerds.module("HelpApp.AwsTutorial", function(AwsTutorial, Landerds, Backbone, Marionette, $, _) {
      AwsTutorial.View = Marionette.ItemView.extend({

        template: SettingsListTpl,

        initialize: function() {
       
        },

        //onRender builds the datatable object with our collection
        onRender: function() {
          var me = this;
   


        }

      });
    });
    return Landerds.HelpApp.AwsTutorial.View;
  });
