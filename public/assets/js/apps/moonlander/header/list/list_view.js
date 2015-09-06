define(["app", "tpl!/assets/js/apps/moonlander/header/list/templates/header_list.tpl"],
function(Moonlander, listTpl){

  Moonlander.module("HeaderApp", function(HeaderApp, Moonlander, Backbone, Marionette, $, _){

    HeaderApp.Header = Marionette.ItemView.extend({
      template: listTpl,
      tagName: "header",
      className: "navbar navbar-fixed-top navbar-shadow",
      
      // modelEvents: {
      //   'change': 'render'
      // },

      // events: {
      //   "click #logout-link": "logout"
      // },

      // logout: function(e){
      //   e.preventDefault();
      //   this.trigger("logout:clicked");
      // },

      onDomRefresh: function() {


      }
    });

    
  });
  return Moonlander.HeaderApp;
});