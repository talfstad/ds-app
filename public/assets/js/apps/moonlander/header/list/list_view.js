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
          var Body = $("body");

          var options = {sbr: "sb-r-c", sbState: "save", collapse: "sb-l-o", siblingRope: true};
          
          // Most CSS menu animations are set to 300ms. After this time
          // we trigger a single global window resize to help catch any 3rd 
          // party plugins which need the event to resize their given elements
          var triggerResize = function() {
            setTimeout(function() {
              $(window).trigger('resize');

              if (Body.hasClass('sb-l-m')) {
                Body.addClass('sb-l-disable-animation');
              } else {
                Body.removeClass('sb-l-disable-animation');
              }
            }, 300)
          };

          // SideBar Left Toggle Function
          var sidebarLeftToggle = function() {

            // If sidebar is set to Horizontal we return
            if ($('body.sb-top').length) {
              return;
            }

            // We check to see if the the user has closed the entire
            // leftside menu. If true we reopen it, this will result
            // in the menu resetting itself back to a minified state.
            // A second click will fully expand the menu.
            // if (Body.hasClass('sb-l-c') && options.collapse === "sb-l-m") {
            //    Body.removeClass('sb-l-c');
            // }

            // Toggle sidebar state(open/close)
            Body.toggleClass(options.collapse).toggleClass('sb-l-c').toggleClass('sb-l-o');
            triggerResize();
          };

          $("#toggle_sidemenu_l").on('click', sidebarLeftToggle);
          
        }
    });

    
  });
  return Moonlander.HeaderApp;
});