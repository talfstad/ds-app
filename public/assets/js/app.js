define(["marionette"],
  function(Marionette, LoginModel) {

    var Moonlander = new Marionette.Application();

    Moonlander.addRegions({
      rootRegion: "#root-region"
    });

    Moonlander.navigate = function(route, options) {
      options || (options = {});
      Backbone.history.navigate(route, options);
    };

    Moonlander.getCurrentRoute = function() {
      return Backbone.history.fragment
    };

    Moonlander.startSubApp = function(appName, args) {
      var currentApp = appName ? Moonlander.module(appName) : null;
      if (Moonlander.currentApp === currentApp) {
        return;
      }

      if (Moonlander.currentApp) {
        Moonlander.currentApp.stop();
      }

      Moonlander.currentApp = currentApp;
      if (currentApp) {
        currentApp.start(args);
      }
    };

    Moonlander.on("start", function() {

      require([
          "assets/js/intercom/intercom_app",
          "assets/js/apps/user/user_app",
          "assets/js/apps/moonlander/entry_point/entry_app",
          "assets/js/live_updater/updater",
          "assets/js/jobs/jobs_app"
        ],
        function() {
          if (Backbone.history) {
            if (history.pushState) {
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


            //START LIVE UPDATER
            Moonlander.updater.initialize();

          }
        });
    });

    return Moonlander;
  });
