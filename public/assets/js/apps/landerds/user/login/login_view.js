define(["app",
    "tpl!assets/js/apps/landerds/user/login/templates/login_view.tpl",
    "assets/js/apps/landerds/common/validation",
    "assets/js/apps/landerds/common/notification",
    "assets/js/apps/landerds/user/user_app",
    "canvasbg",
    "bootstrap"
  ],
  function(Landerds, LoginViewTpl, Validation, Notification) {
    Landerds.module("UserApp.Login", function(Login, Landerds, Backbone, Marionette, $, _) {

      Login.showLogin = Marionette.ItemView.extend({
        id: "login-container",
        className: "admin-form theme-info",
        template: LoginViewTpl,

        initialize: function() {
          Validation.bindView(this);
        },

        events: {
          'click #sign-in-button': 'submitLoginForm',
          'click .forgot-password': 'forgotPassword'
        },

        modelEvents: {
          "change:alertLoading": "alertLoading"
        },

        forgotPassword: function(e) {
          if (e) e.preventDefault();
          Landerds.trigger("show:resetPassword");
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

    return Landerds.UserApp.Login;
  });
