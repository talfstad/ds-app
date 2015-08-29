define(["marionette", 
        "assets/js/apps/user/session/session_model.js"], 
function(Marionette, SessionModel){

  var Moonlander = new Marionette.Application();

  Moonlander.session = new SessionModel({});

  Moonlander.addRegions({
    rootRegion: "#root-region"
  });

  Moonlander.navigate = function(route,  options){
    options || (options = {});
    Backbone.history.navigate(route, options);
  };

  Moonlander.getCurrentRoute = function(){
    return Backbone.history.fragment
  };
  
  Moonlander.startSubApp = function(appName, args){
    var currentApp = appName ? Moonlander.module(appName) : null;
    if (Moonlander.currentApp === currentApp){ return; }
    
    if (Moonlander.currentApp){
      Moonlander.currentApp.stop();
    }

    Moonlander.currentApp = currentApp;
    if(currentApp){
      currentApp.start(args);
    }
  };

  Moonlander.on("start", function(){
    
    require(["assets/js/apps/user/user_app.js", 
             "assets/js/apps/moonlander/entry_point/entry_app.js"], 
    function () {
      if(Backbone.history){
        if(history.pushState) {
          Backbone.history.start({
            pushState: true
          });
        } else {
          Backbone.history.start({
            pushState: false
          });
        }

        //CSRF Protection. Adding to all calls as a global prefilter
        $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
          var token;
          options.xhrFields = {
            withCredentials: true
          };
          token = $('meta[name="csrf-token"]').attr('content');
          if (token) {
            return jqXHR.setRequestHeader('X-CSRF-Token', token);
          }
        });
      }
    });
  });

  return Moonlander;
});