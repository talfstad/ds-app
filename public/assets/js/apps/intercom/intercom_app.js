define(["app"], function(Landerds) {

  Landerds.intercom = {

    isLoaded: false,

    boot: function() {
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
