define(["app"],
  function(Landerds) {
    var SidebarModel = Backbone.Model.extend({
      
      urlRoot: "",

      defaults: {
        name: "",
        deploy_status: ""
      },

    });
    return SidebarModel;
  });
