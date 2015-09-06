define(["app",
        "tpl!apps/header/list/templates/list.tpl", "slimscroll"],
        function(Moonlander, listTpl, listItemTpl){

  Moonlander.module("HeaderApp.List.View", function(ListView, Moonlander, Backbone, Marionette, $, _){

    ListView.Header = Marionette.ItemView.extend({
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

    
    return Moonlander.HeaderApp.List.ListView;
  });
});