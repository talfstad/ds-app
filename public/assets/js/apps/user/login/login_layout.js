define(["app",
    "tpl!assets/js/apps/user/login/templates/login_layout.tpl",
  ],

  function(Moonlander, loginLayoutTpl) {
    Moonlander.module("UserApp.Login", function(Login, Moonlander, Backbone, Marionette, $, _) {

      Login.Layout = Marionette.LayoutView.extend({
        id: "main",
        className: "animated fadeIn",
        template: loginLayoutTpl,

        regions: {
          content: "#content"
        }
      });
    });
    return Moonlander.UserApp.Login.Layout;
  });
