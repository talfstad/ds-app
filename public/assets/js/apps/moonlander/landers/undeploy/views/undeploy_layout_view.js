define(["app",
    "tpl!/assets/js/apps/moonlander/landers/undeploy/templates/undeploy_layout.tpl"
  ],
  function(Moonlander, UndeployLayoutTemplate) {

    Moonlander.module("LandersApp.Landers.Undeploy", function(Undeploy, Moonlander, Backbone, Marionette, $, _) {

      Undeploy.Layout = Marionette.LayoutView.extend({

        id: "undeploy-lander-modal",

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: UndeployLayoutTemplate,

        regions: {

        },

        events: {
          "click .undeploy-confirm": "confirmedToUndeploy"
        },

        confirmedToUndeploy: function() {
          var me = this;          

          var successfullyStartedUndeploy = function(model, message, other) {
            me.model.set(model.attributes); //sets deployed_status, procesing
            Moonlander.updater.add(me.model);
          };
          
          //on load for each model that has live_update enabled: 
          //should be done in the models class on init
          //1. check if model has processing=true
          //2. if processing add it to the live_updater
          //3. render as normal
          
          //7. listen to childview from collectionview itemview
          //8. collectionview itemview updates the collectionview model deploy_status, causes render (renders childviews too)
          //9. on render it doesnt collapse the view, only collapses on first render (todo)

        
          this.model.set("action", "undeploy");
          this.model.save({}, {
            success: successfullyStartedUndeploy
          });
          
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
    return Moonlander.LandersApp.Landers.Undeploy.Layout;
  });