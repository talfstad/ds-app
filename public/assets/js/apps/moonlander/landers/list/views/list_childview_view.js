define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/templates/landers_child_item.tpl",
    "/assets/js/apps/moonlander/landers/list/deployed/views/deployed_domains_collection_view.js",
    "/assets/js/apps/moonlander/landers/list/deployed/views/deployed_domains_empty_view.js",
    "moment",
    "bootstrap"
  ],
 function(Moonlander, LandersListItemTpl, DeployedListChildView, DeployedListEmptyView, moment) {

  Moonlander.module("LandersApp.Landers.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.childView = Marionette.LayoutView.extend({
      className: "bs-component accordion-group",

      template: LandersListItemTpl,
      childView: DeployedListChildView,
      emptyView: DeployedListEmptyView,
      childViewContainer: "table.deployed-domains-region",

      events: {
        "click button.deploy-to-domain": "showDeployLanderToDomain"
      },

      regions: {
        'deploy_status_region':'.deploy-status-region',
        'deployed_domains_region': '.deployed-domains-region',
        'campaign_tab_handle_region': '.campaign-tab-handle-region',
        'active_campaigns_region': '.active_campaigns_region'
      },

      showDeployLanderToDomain: function(){
        Moonlander.trigger("landers:showDeployToDomain", this.model);
      },

      onBeforeRender: function(){
        var lastUpdatedRawMysqlDateTime = this.model.get("last_updated");
        var formattedTime = moment(new Date(lastUpdatedRawMysqlDateTime)).format("MMM DD, YYYY HH:MM A");
        this.model.set("last_updated", formattedTime);
      },  

      onRender: function(){
        
        var me = this;

        //add/remove hovering attribute so we can correctly animate closing of the right sidebar
        this.$el.find(".accordion-toggle").hover(function(e){
          $(e.currentTarget).attr("data-currently-hovering", true);
        },
        function(e){
          $(e.currentTarget).attr("data-currently-hovering", false);
        });

        this.$el.find(".campaign-tab-handle-region").hover(function(e){
          $(e.currentTarget).attr("data-currently-hovering", true);
        }, function(e){
          $(e.currentTarget).attr("data-currently-hovering", false);
        });

        this.$el.find(".deploy-status-region").hover(function(e){
          $(e.currentTarget).attr("data-currently-hovering", true);
        }, function(e){
          $(e.currentTarget).attr("data-currently-hovering", false);
        });

        this.$el.on('hide.bs.collapse', function(e) {
          
          //close right sidebar if closing all domain accordions
          if ($(e.currentTarget).find("a[data-currently-hovering='true']").length > 0) {
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

            //first dont show any tabs then show correct tab
            $(e.currentTarget).find("li.deploy-status-region").removeClass("active");
            $(e.currentTarget).find("div[id^='domains-tab']").removeClass("active");
            $(e.currentTarget).find("li.campaign-tab-handle-region").removeClass("active");
            $(e.currentTarget).find("div[id^='campaigns-tab']").removeClass("active");
            //show the correct tab
            var currentTab = $(e.currentTarget).find("li[data-currently-hovering='true']");
            var currentTabData = $("#"+currentTab.attr("data-tab-target"));
            if(currentTab.length > 0) {
              //show clicked on tab
              currentTab.addClass("active");
              currentTabData.addClass("active");
            } else {
              //no tab show domains tab
              $(e.currentTarget).find("li.deploy-status-region").addClass("active");
              $(e.currentTarget).find("div[id^='domains-tab']").addClass("active");
            }


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


      }
    });
  });
  return Moonlander.LandersApp.Landers.List.childView;
});
