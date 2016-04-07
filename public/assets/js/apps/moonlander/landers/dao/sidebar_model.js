define(["app"],
  function(Moonlander) {
    var SidebarModel = Backbone.Model.extend({
      
      urlRoot: "",

      defaults: {
        name: "",
        deploy_root: false,
        optimized: true,
        deploy_status: ""
      },

    });
    return SidebarModel;
  });
