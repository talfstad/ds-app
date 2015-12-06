define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/templates/landers_child_item.tpl",
    "/assets/js/apps/moonlander/landers/list/deployed/views/deployed_domains_collection_view.js",
    "/assets/js/apps/moonlander/landers/list/deployed/views/deployed_domains_empty_view.js",
    "/assets/js/apps/moonlander/landers/dao/sidebar_model.js",
    "moment-timezone",
    "/assets/js/apps/moonlander/landers/list/views/deploy_status_view.js",
    "/assets/js/apps/moonlander/landers/list/views/campaign_tab_handle_view.js",
    "/assets/js/apps/moonlander/landers/list/active_campaigns/views/active_campaigns_collection_view.js",
    "/assets/js/apps/moonlander/landers/list/deployed/views/deployed_domains_collection_view.js",
    "bootstrap",
    "jstz"
  ],
  function(Moonlander, LandersListItemTpl, DeployedListChildView, DeployedListEmptyView, SidebarModel, moment,
    DeployStatusView, CampaignTabHandleView, ActiveCampaignsView, DeployedDomainsView) {

    Moonlander.module("LandersApp.Landers.List", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.childView = Marionette.LayoutView.extend({

        initialize: function(){
          var me = this;
          this.listenTo(this.model, "view:expand", function(){
            me.expandAccordion();
          });
        },

        className: "bs-component accordion-group",

        template: LandersListItemTpl,
        childView: DeployedListChildView,
        emptyView: DeployedListEmptyView,
        childViewContainer: "table.deployed-domains-region",

        events: {
          "click button.deploy-to-domain": "showDeployLanderToDomain",
          "click button.add-to-campaign": "showAddToCampaign"
        },

        regions: {
          'deploy_status_region': '.deploy-status-region',
          'deployed_domains_region': '.deployed-domains-region',
          'campaign_tab_handle_region': '.campaign-tab-handle-region',
          'active_campaigns_region': '.active_campaigns_region',
          'deploy_to_new_domain_region': '.deploy-to-new-domain-region',
          'add_to_new_campaign_region': '.add-to-new-campaign-region'
        },

        showDeployLanderToDomain: function() {
          Moonlander.trigger("landers:showDeployToDomain", this.model);
        },

        showAddToCampaign: function() {
          Moonlander.trigger("landers:showAddToCampaign", this.model);
        },

        onBeforeRender: function() {
          var lastUpdatedRawMysqlDateTime = this.model.get("last_updated");
          var timezoneName = new jstz().timezone_name;
          var formattedTime = moment.utc(lastUpdatedRawMysqlDateTime, "MMM DD, YYYY h:mm A").tz(timezoneName).format("MMM DD, YYYY h:mm A");
          this.model.set("last_updated_gui", formattedTime);
        },

        expandAccordion: function(){
          this.$el.find("a:first").click();
        },


        disableAccordionPermanently: function() {
          //disable tab links
          var me = this;

          // first try collapsing it
          $("#landers-collection .collapse").collapse("hide");

          this.$el.find(".campaign-tab-handle-region").off();
          this.$el.find(".accordion-toggle").off();
          this.$el.find(".deploy-status-region").off()
          this.$el.off();
          this.$el.find(".nav.panel-tabs").off();

          this.$el.find(".accordion-toggle").click(function(e) {
            e.preventDefault();
            return false;
          });

          //disable main link
          // this.$el.find(".accordion-toggle").removeAttr("data-toggle");
          this.$el.find(".accordion-toggle").hover(function() {
              $(this).addClass("disabled-link");
          });
         
          this.$el.find("ul li").addClass("disabled");

        },

        onRender: function() {

          var me = this;

          //if deleting need to show delet state (which is disabling the whole thing)
          if (this.model.get("deploy_status") === "deleting") {
            this.disableAccordionPermanently();
          } else {

          //add/remove hovering attribute so we can correctly animate closing of the right sidebar
          this.$el.find(".accordion-toggle").hover(function(e) {
              $(e.currentTarget).attr("data-currently-hovering", true);
            },
            function(e) {
              $(e.currentTarget).attr("data-currently-hovering", false);
            });

          this.$el.find(".campaign-tab-handle-region").hover(function(e) {
            $(e.currentTarget).attr("data-currently-hovering", true);
          }, function(e) {
            $(e.currentTarget).attr("data-currently-hovering", false);
          });

          this.$el.find(".deploy-status-region").hover(function(e) {
            $(e.currentTarget).attr("data-currently-hovering", true);
          }, function(e) {
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
            var currentTabData = $("#" + currentTab.attr("data-tab-target"));
            if (currentTab.length > 0) {
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

            //pass a clone not the real model so everyone gets their own. no references for
            //right sidebar, interferes with active snippets
            Moonlander.trigger('landers:opensidebar', new SidebarModel(me.model.attributes));

          });

          this.$el.on('shown.bs.collapse', function(e) {
            //enable the anchor tags
            $(".accordion-toggle").removeClass("inactive-link");

          });

          this.$el.find(".nav.panel-tabs").click(function(e) {
            $(e.currentTarget).parent().parent().find(".panel-collapse").collapse('show');
          });
}

        }
      });
    });
    return Moonlander.LandersApp.Landers.List.childView;
  });
