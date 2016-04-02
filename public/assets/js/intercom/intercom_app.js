define(["app"], function(Moonlander) {

  Moonlander.intercom = {

    isLoaded: false,

    boot: function() {
      var me = this;
      if (!this.isLoaded) {
        var millis = new Date();
        millis = millis.getTime();

        window.Intercom('boot', {
          app_id: 'wgf4en1r',
          user_id: Moonlander.loginModel.get("user_id"),
          created_at: millis,
          email: Moonlander.loginModel.get("username"),
          widget: {
            activator: '#IntercomDefaultWidget'
          }
        });

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


  return Moonlander.intercom;
});
