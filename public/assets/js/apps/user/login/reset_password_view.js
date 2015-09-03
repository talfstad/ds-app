define(["app",
        "tpl!/assets/js/apps/user/login/templates/reset_password.tpl",
        "/assets/js/common/validation.js",
        "/assets/js/common/notification.js",
        "canvasbg",
        "theme.utility",
        "theme.demo",
        "theme.main"],
function(Moonlander, ResetPasswordTpl, Validation, Notification){
  Moonlander.module("UserApp.Login", function(Login, Moonlander, Backbone, Marionette, $, _){
    
    Login.showForgotPassword = Marionette.ItemView.extend({
      id: "reset-password-login",
      className: "admin-form theme-info mw500",
      template: ResetPasswordTpl,

      initialize: function(){
        Validation.bindView(this);
      },

      events: {
        'click label.button': 'submitResetPasswordForm',
      },

      submitResetPasswordForm: function(e){
        e.preventDefault();
        this.trigger("reset:form:submit");
      },

      showInvalidUserPassError: function(){
        $(".admin-form").removeClass("theme-info").addClass("theme-danger");
        $(".panel").removeClass("panel-info").addClass("panel-danger");
        Notification("Invalid Username or Password", "Please try again entering your credentials again.", "danger", "stack_bar_top");
      },

      // hideInvalidUserPassError: function(){
      //   $(".theme-info").removeClass("theme-danger").addClass("theme-info");
      //   $(".theme-panel").removeClass("panel-danger").addClass("panel-info");
      // },

      onDomRefresh: function(){
        "use strict";

        // Init Theme Core      
        Core.init();

        // Init Demo JS
        Demo.init();

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