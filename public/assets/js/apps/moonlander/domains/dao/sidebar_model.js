define(["app"],
  function(Moonlander) {
    var SidebarModel = Backbone.Model.extend({
      
      urlRoot: "",

      defaults: {
        name: "",
        optimize_js: false,
        optimize_css: false,
        optimize_images: false,
        optimize_gzip: false,
        deploy_status: ""
      },

    });
    return SidebarModel;
  });
