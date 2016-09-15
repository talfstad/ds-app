define(["app", 
    "assets/js/apps/help/aws_tutorial/aws_tutorial_controller"  
  ],
  function(Landerds, AwsTutorialController) {
    Landerds.module("GroupsApp", function(GroupsApp, Landerds, Backbone, Marionette, $, _) {

      var helpAppAPI = {
       
        showAwsTutorial: function() {
          AwsTutorialController.showAwsTutorial();
        }

      };

      Landerds.on("help:showAwsTutorial", function() {
        helpAppAPI.showAwsTutorial();
      });
    });

    return Landerds.HelpApp;
  });
