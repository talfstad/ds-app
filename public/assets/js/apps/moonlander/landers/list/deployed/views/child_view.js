define(["app",
    "/assets/js/apps/moonlander/landers/list/deployed/views/deployed_domain_row_view.js",
    "/assets/js/apps/moonlander/landers/list/deployed/views/empty_view.js"
  ],
  function(Moonlander, DeployedDomainRowView, EmptyView) {

    Moonlander.module("LandersApp.Landers.List.Deployed", function(Deployed, Moonlander, Backbone, Marionette, $, _) {
      Deployed.ChildView = Marionette.CollectionView.extend({
        tagName: "ul",
        childView: DeployedDomainRowView,
        emptyView: EmptyView,

        //pass the deployed list its rendered index for # column
        childViewOptions: function(model) {
          model.set('viewIndex', parseInt(this.collection.indexOf(model))+1);
          model.set('urlEndpoints', this.collection.urlEndpoints);
        },

        initialize: function(){

        },
        
        onRender: function() {
        
        }

      
      });
    });
    return Moonlander.LandersApp.Landers.List.Deployed.ChildView;
  });
