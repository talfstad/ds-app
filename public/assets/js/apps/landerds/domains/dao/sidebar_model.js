define(["app"],
  function(Landerds) {
    var SidebarModel = Backbone.Model.extend({
      
      urlRoot: "",

      defaults: {
        name: "",
        optimized: true,
        deploy_root: false,
        deploy_status: ""
      },

    });
    return SidebarModel;
  });
