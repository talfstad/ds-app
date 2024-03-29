define(["app", "tpl!assets/js/apps/landerds/header/list/templates/header_list.tpl"],
function(Landerds, listTpl){

  Landerds.module("HeaderApp", function(HeaderApp, Landerds, Backbone, Marionette, $, _){

    HeaderApp.Header = Marionette.ItemView.extend({
      template: listTpl,
      tagName: "header",
      className: "lds-top-nav navbar-inverse navbar-fixed-top navbar-shadow",

      events: {
        "click .go-domains": "goDomains",
        "click .go-groups": "goGroups",
        "click .go-landers": "goLanders"
      },

      goDomains: function(e){
        e.preventDefault();
        this.trigger("showDomains");
      },

      goGroups: function(e){
        e.preventDefault();
        this.trigger("showGroups");
      },

      goLanders: function(e){
        e.preventDefault();
        this.trigger("showLanders");
      },

      setActiveItem: function(item){
        //remove all actives
        $(".lds-top-nav ul:first li").removeClass("active");

        //set active for correct item
        $(".lds-top-nav ul:first li." + item).addClass("active");
      },

      onDomRefresh: function() {

        var me = this;

        //done here instead of events because event isnt triggered on click the other way
        //for some reason...
        $("a.user-logout").click(function(e){
          e.preventDefault();
          Landerds.trigger("user:logout");
        });

        $("a.user-settings-account").click(function(e){
          e.preventDefault();
          
          me.$el.find(".navbar-right li").removeClass("open")

          //show settings now that dropdown is closed 
          Landerds.trigger("user:showSettings");
        
        });


          
      }
    });

    
  });
  return Landerds.HeaderApp;
});