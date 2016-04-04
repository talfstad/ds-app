define(["app",
    "tpl!assets/js/apps/moonlander/landers/list/templates/landers_empty_items.tpl"
  ],
  function(Moonlander, landersListEmptyItemsTpl) {

    Moonlander.module("LandersApp.Landers.List", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.EmptyView = Marionette.ItemView.extend({

        template: landersListEmptyItemsTpl,

        initialize: function() {
          var me = this;
          Moonlander.loginModel.on("change:accessKeyId", function(one, two, three) {
            if (Moonlander.loginModel.get("accessKeyId")) {
              me.model.set("showAwsHelp", false);
            }
          });
        },

        modelEvents: {
          "change:showAwsHelp": "render"
        },

        onBeforeRender: function() {

          if (Moonlander.loginModel.get("accessKeyId") || Moonlander.loginModel.get("aws_access_key_id")) {
            this.model.set("showAwsHelp", false);
          } else {
            this.model.set("showAwsHelp", true);
          }

        }

      });
    });
    return Moonlander.LandersApp.Landers.List.EmptyView;
  });
