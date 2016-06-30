define(["app",
    "tpl!assets/js/apps/user/login/templates/login_layout.tpl",
  ],

  function(Landerds, loginLayoutTpl) {
    Landerds.module("UserApp.Login", function(Login, Landerds, Backbone, Marionette, $, _) {

      Login.Layout = Marionette.LayoutView.extend({
        id: "main",
        className: "animated fadeIn",
        template: loginLayoutTpl,

        regions: {
          content: "#content"
        }
      });
    });
    return Landerds.UserApp.Login.Layout;
  });
