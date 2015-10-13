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
          this.model.set("action", "undeploy");

          var successfullyStartedUndeploy = function(model, message, other){


            this.model.set("deploy_status", "undeploying");

          };
          
          //need to update the original lander model using its id
            //  so that server side reads 'action' is something and triggers the action to start
            // and returns successfully started flag

          //.  make an actual domain model which has a rootUrl that will call out with id to update domain
          //0. adds action 'undeploy' so server knows what to do on domain model
          //1. puts to server, server checks if there is an action
          //2. if action server sends request out to start action
          //3. worker updates processing = true and responds success
          //4. sends response setting processing = true for client (worker guarantees it)

          //5. set the modal model deploy_status to undeploying, triggers render on childview
          //6. childview template sets the table classes depending on deploy_status
          //7. listen to childview from collectionview itemview
          //8. collectionview itemview updates the collectionview model deploy_status, causes render
          //9. on render it doesnt collapse the view, only collapses on first render (todo)

          //8. add modal model to live update collection for updates

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