define(["app",
    "tpl!/assets/js/apps/moonlander/landers/deploy_to_domain/templates/deploy_to_domain_layout.tpl"
  ],
  function(Moonlander, DeployToDomainLayout) {

    Moonlander.module("LandersApp.Landers.DeployToDomain", function(DeployToDomain, Moonlander, Backbone, Marionette, $, _) {

      DeployToDomain.Layout = Marionette.LayoutView.extend({

        id: "undeploy-lander-modal",

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: DeployToDomainLayout,

        regions: {
          "domainsListRegion": ".domains-list-region"
        },

        events: {
          "click .deploy-confirm": "confirmedToDeploy"
        },

        confirmedToDeploy: function() {

          // this.trigger("deployLanderToDomain", this.model);      
        
        },

        onRender: function() {
          var me = this;

          this.$el.off('show.bs.modal');
          this.$el.off('shown.bs.modal');

          this.$el.on('show.bs.modal', function(e){
          
           
          });

          this.$el.on('shown.bs.modal', function(e) {


          });

          this.$el.modal('show');

        },

        onClose: function() {
          this.$el.modal('hide');
        },

        onDomRefresh: function() {


        }
      });

    });
    return Moonlander.LandersApp.Landers.DeployToDomain.Layout;
  });