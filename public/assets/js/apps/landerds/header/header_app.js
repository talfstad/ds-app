define(["app",
    "assets/js/apps/landerds/header/list/list_controller",
    "assets/js/common/login/common_login"
  ],
  function(Landerds, ListController, CommonLogin) {
    Landerds.module("HeaderApp", function(Header, Landerds, Backbone, Marionette, $, _) {

      var headerAPI = {
        listHeader: function(callback) {
          CommonLogin.Check(ListController.listHeader, callback);
        },
        setActiveItem: function(item) {
          ListController.setActiveItem(item);
        }
      };

      Landerds.on("header:list", function(callback) {
        headerAPI.listHeader(callback);
      });

      Landerds.on("header:active", function(item) {
        headerAPI.setActiveItem(item);
      });

    });

    return Landerds.HeaderApp;
  });
