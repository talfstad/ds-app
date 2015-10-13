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
            me.model.set("deploy_status", "undeploying");
            Moonlander.updater.add(me.model);
          };
          
          
          //.  make an actual domain model which has a rootUrl that will call out with id to update domain --DONE
          //0. adds action 'undeploy' so server knows what to do on domain model --DONE
          //1. puts to server, server checks if there is an action
          //2. if action server sends request out to start action
          //3. worker updates processing = true and responds success
          //4. sends response setting processing = true for client (worker guarantees it)

          //5. set the domain model deploy_status to undeploying, triggers render on childview (maybe no render here) --DONE
          //6. childview template sets the table classes depending on deploy_status --DONE
          //7. listen to childview from collectionview itemview
          //8. collectionview itemview updates the collectionview model deploy_status, causes render (renders childviews too)
          //9. on render it doesnt collapse the view, only collapses on first render (todo)

          //10. add modal model to live update collection for updates
          //11. worker updates domain processessing=false, and deploy_status=undeployed when done
          //12. live update gets that processing is false

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