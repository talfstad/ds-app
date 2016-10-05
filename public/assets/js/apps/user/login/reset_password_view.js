define(["app",
    "tpl!assets/js/apps/user/login/templates/reset_password.tpl",
    "tpl!assets/js/apps/user/login/templates/reset_password_step2.tpl",
    "assets/js/common/validation",
    "assets/js/common/notification",
    "canvasbg"
  ],
  function(Landerds, ResetPasswordTpl, ResetPasswordStep2Tpl, Validation, Notification) {
    Landerds.module("UserApp.Login", function(Login, Landerds, Backbone, Marionette, $, _) {

      Login.showForgotPassword = Marionette.ItemView.extend({
        id: "reset-password-login",
        className: "admin-form theme-info mw500",
        template: ResetPasswordTpl,

        initialize: function() {
          Validation.bindView(this);
        },

        events: {
          'click label.button': 'submitResetPasswordForm',
          'click .show-login': 'showLogin'
        },

        showLogin: function(e) {
          if (e) e.preventDefault();
          Landerds.execute("show:login");
        },

        submitResetPasswordForm: function(e) {
          e.preventDefault();
          this.trigger("reset:form:submit");
        },

        showCheckEmailMessage: function(msg) {
          if (msg.emailSent) {
            Notification("An email has been sent to you", "Click the link in the email we sent you to reset your password", "success", "stack_bar_top");
          } else {
            Notification("We could not send you an email. Make sure you're using the email you login with.", "danger", "stack_bar_top");
          }
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

      Login.showForgotPasswordStep2 = Marionette.ItemView.extend({
        id: "reset-password-login",
        className: "admin-form theme-info mw500",
        template: ResetPasswordStep2Tpl,

        initialize: function() {
          Validation.bindView(this);
        },

        events: {
          'click #password-reset-button': 'submitResetPasswordForm',
        },

        submitResetPasswordForm: function(e) {
          if (e) e.preventDefault();
          this.trigger("reset:form:submit");
        },

        showSuccessfulReset: function() {
          Notification("Your password has been reset", "Please try logging in with it.", "success", "stack_bar_top");
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
