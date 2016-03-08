define(["app",
    "tpl!assets/js/apps/user/login/templates/login_view.tpl",
    "/assets/js/common/validation.js",
    "/assets/js/common/notification.js",
    "canvasbg",
    "bootstrap"
    // "theme.utility",
    // "theme.demo",
    // "theme.main"
  ],
  function(Moonlander, LoginViewTpl, Validation, Notification) {
    Moonlander.module("UserApp.Login", function(Login, Moonlander, Backbone, Marionette, $, _) {

      Login.showLogin = Marionette.ItemView.extend({
        id: "login-container",
        className: "admin-form theme-info",
        template: LoginViewTpl,

        initialize: function() {
          Validation.bindView(this);
        },

        events: {
          'click #sign-in-button': 'submitLoginForm'
        },

        modelEvents: {
          "change:alertLoading": "alertLoading"
        },

        alertLoading: function() {
          if (this.model.get("alertLoading")) {
            this.$el.find("span[data-handle='domain']").text(this.model.get("domain"));
            this.$el.find(".alert-loading").fadeIn();
          } else {
            this.$el.find(".alert-loading").hide();
          }
        },

        submitLoginForm: function(e) {
          e.preventDefault();
          this.trigger("login:form:submit");
        },

        showInvalidUserPassError: function() {
          $(".admin-form").removeClass("theme-info").addClass("theme-danger");
          $(".panel").removeClass("panel-info").addClass("panel-danger");
          Notification("Invalid Username or Password", "Please try again entering your credentials again.", "danger", "stack_bar_top");
        },

        hideInvalidUserPassError: function() {
          $(".theme-info").removeClass("theme-danger").addClass("theme-info");
          $(".theme-panel").removeClass("panel-danger").addClass("panel-info");
        },

        onDomRefresh: function() {

          // Init CanvasBG and pass target starting location
          CanvasBG.init({
            Loc: {
              x: window.innerWidth / 2,
              y: window.innerHeight / 3.3
            },
          });

          $("body").addClass("external-page sb-l-c sb-r-c onload-check");

        }

      });
    });

    return Moonlander.UserApp.Login;
  });
