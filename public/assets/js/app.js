define(["marionette"],
  function(Marionette, LoginModel) {

    var Landerds = new Marionette.Application();

    Landerds.addRegions({
      rootRegion: "#root-region"
    });

    Landerds.navigate = function(route, options) {
      options || (options = {});
      Backbone.history.navigate(route, options);
    };

    Landerds.getCurrentRoute = function() {
      return Backbone.history.fragment
    };

    Landerds.startSubApp = function(appName, args) {
      var currentApp = appName ? Landerds.module(appName) : null;
      if (Landerds.currentApp === currentApp) {
        return;
      }

      if (Landerds.currentApp) {
        Landerds.currentApp.stop();
      }

      Landerds.currentApp = currentApp;
      if (currentApp) {
        currentApp.start(args);
      }
    };

    Landerds.on("start", function() {

      require([
          "assets/js/intercom/intercom_app",
          "assets/js/apps/user/user_app",
          "assets/js/apps/landerds/entry_point/entry_app",
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
          }
        });
    });

    return Landerds;
  });
