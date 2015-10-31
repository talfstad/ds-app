define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/templates/landers_child_item.tpl",
    "/assets/js/apps/moonlander/landers/list/deployed/views/deployed_domains_collection_view.js",
    "/assets/js/apps/moonlander/landers/list/deployed/views/deployed_domains_empty_view.js",
    "bootstrap"
  ],
 function(Moonlander, LandersListItemTpl, DeployedListChildView, DeployedListEmptyView) {

  Moonlander.module("LandersApp.Landers.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.childView = Marionette.LayoutView.extend({
      className: "bs-component accordion-group",

      template: LandersListItemTpl,
      childView: DeployedListChildView,
      emptyView: DeployedListEmptyView,
      childViewContainer: "table.deployed-domains-region",

      regions: {
        'deploy_status_region':'.deploy-status-region',
        'deployed_domains_region': '.deployed-domains-region'
      },

      initialize: function() {
        var me = this;
        //set collection to subset of parent collection (from collectionview)
        this.collection = this.model.deployedLocations;

        
      },

      onBeforeRender: function(){
        var me = this;
        //figure out what the deploy_status should be here
        var deployStatus = "deployed";
        if(this.collection.length <= 0) {
          deployStatus = "not_deployed";
        }
        $.each(this.collection.models, function(idx, model){
          var modelDeployedStatus = model.get("deploy_status");
          if(modelDeployedStatus === "deploying") {
            deployStatus = "deploying";
          }
        });
        this.model.set("deploy_status", deployStatus);
      },

      onRender: function(){
        
        var me = this;

        this.$el.on('hide.bs.collapse', function(e) {
          //close right sidebar if closing all domain accordions
          if ($(".collapse-in").length <= 1) {
            Moonlander.trigger('landers:closesidebar');
          }

          $(e.currentTarget).find("li.active").removeClass("active");
          $(e.currentTarget).find(".accordion-toggle").removeClass('active');

        });

        this.$el.on('show.bs.collapse', function(e) {
            //collapse ALL others so we get an accordian effect !IMPORTANT for design
            $("#landers-collection .collapse").collapse("hide");
            
            //disable the controls until shown (fixes multiple showing bug if clicked too fast)
            $(".accordion-toggle").addClass("inactive-link");

            $(e.currentTarget).find("li:first").addClass("active");
            $(e.currentTarget).find(".accordion-toggle").addClass('active')

            $(e.currentTarget).parent().find(".panel").addClass(".panel-info");


            Moonlander.trigger('landers:opensidebar', me.model);

          });

          this.$el.on('shown.bs.collapse', function(e) {
            //enable the anchor tags
            $(".accordion-toggle").removeClass("inactive-link");

          });

         this.$el.find(".nav.panel-tabs").click(function(e) {
            $(e.currentTarget).parent().parent().find(".panel-collapse").collapse('show');
          });


      },

      onDomRefresh: function() {
        var me = this;

      }

    });
  });
  return Moonlander.LandersApp.Landers.List.childView;
});
