define(["app"], function(Landerds) {

  Landerds.intercom = {

    isLoaded: false,

    boot: function(callback) {
      var me = this;
      if (!this.isLoaded) {
        var millis = new Date();
        millis = millis.getTime();

        window.Intercom('boot', {
          app_id: 'wgf4en1r',
          user_id: Landerds.loginModel.get("user_id"),
          created_at: millis,
          email: Landerds.loginModel.get("username"),
          widget: {
            activator: '#IntercomDefaultWidget'
          }
        });

        var retries = 25; //5 seconds @ 200 millis
        var retryCount = 0;

        var resizeIntercomButton = function(intercomIsLoadedFlagEl) {

          var iframeContents = intercomIsLoadedFlagEl.contents();

          iframeContents.find("#intercom-container .intercom-launcher").css("width", "40px");
          iframeContents.find("#intercom-container .intercom-launcher").css("border", "1px solid rgb(44,131,236)");
          iframeContents.find("#intercom-container .intercom-launcher").css("opacity", "0.7");
          iframeContents.find("#intercom-container .intercom-launcher").css("height", "40px");
          iframeContents.find(".intercom-launcher-open-icon").css("background-size", "17px 18px");
          iframeContents.find(".intercom-launcher-open-icon").css("background-position", "center 12px");

          iframeContents.find("#intercom-container .intercom-launcher").hover(
            function() {
              $(this).css("opacity", "1.0");
            },
            function() {
              $(this).css("opacity", "0.7");
            });

          $("style#intercom-stylesheet").remove();

        };

        var pollForIntercomLoaded = function() {
          var intercomIsLoadedFlagEl = $("#intercom-container iframe.intercom-launcher-frame");
          setTimeout(function() {
            if (intercomIsLoadedFlagEl.length) {
              resizeIntercomButton(intercomIsLoadedFlagEl);
              callback();
            } else {
              if (retryCount < retries) {
                pollForIntercomLoaded();
              } else {
                callback();
              }
              retryCount++;
            }
          }, 200);
        };
        pollForIntercomLoaded();

        this.isLoaded = true;
      }
    },

    update: function() {
      window.Intercom('update');
    },

    shutdown: function() {
      window.Intercom('shutdown');
      this.isLoaded = false;
    }
  };


  return Landerds.intercom;
});
