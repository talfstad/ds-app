define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/templates/landers_list.tpl"
  ],
  function(Moonlander, landersListTpl) {

    Moonlander.module("LandersApp.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.View = Marionette.ItemView.extend({

        template: landersListTpl,
        tagName: "section",
        id: "content_wrapper",

        onDomRefresh: function() {
          
        }

      });


    });
    return Moonlander.LandersApp.List.View;
  });
