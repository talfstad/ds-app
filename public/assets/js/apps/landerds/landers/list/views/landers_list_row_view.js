define(["app",
    "tpl!assets/js/apps/landerds/landers/list/templates/landers_list_row.tpl",
    "assets/js/apps/landerds/landers/list/deployed_domains/views/deployed_domains_collection_view",
    "assets/js/apps/landerds/landers/list/deployed_domains/views/deployed_domains_empty_view",
    "assets/js/apps/landerds/landers/dao/sidebar_model",
    "moment-timezone",
    "assets/js/apps/landerds/landers/list/views/domain_tab_handle_view",
    "assets/js/apps/landerds/landers/list/views/campaign_tab_handle_view",
    "assets/js/apps/landerds/landers/list/active_campaigns/views/active_campaigns_collection_view",
    "assets/js/apps/landerds/landers/list/deployed_domains/views/deployed_domains_collection_view",
    "bootstrap",
    "jstz"
  ],
  function(Landerds, LandersListItemTpl, DeployedListChildView, DeployedListEmptyView, SidebarModel, moment,
    DeployStatusView, CampaignTabHandleView, ActiveCampaignsView, DeployedDomainsView) {

    Landerds.module("LandersApp.Landers.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.childView = Marionette.LayoutView.extend({

        initialize: function() {
          var me = this;
          this.listenTo(this.model, "view:expand", function() {
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

        modelEvents: {
          "change:deploy_status": "alertDeployStatus",
          "change:modified": "alertDeployStatus"
        },

        regions: {
          'deploy_status_region': '.deploy-status-region',
          'deployed_domains_region': '.deployed-domains-region',
          'campaign_tab_handle_region': '.campaign-tab-handle-region',
          'active_campaigns_region': '.active_campaigns_region'
        },

        alertDeployStatus: function() {
          var capitalizeFirstLetter = function(string) {
            string = string.toLowerCase();
            return string.charAt(0).toUpperCase() + string.slice(1);
          }

          //show correct one
          var deployStatus = this.model.get("deploy_status");

          this.$el.find(".alert-modified-badge").hide();
          if (deployStatus !== "deployed" && deployStatus !== "not_deployed") {
            this.$el.find(".alert-working-badge").show();
          } else {
            this.$el.find(".alert-working-badge").hide();
          }

          if (this.model.get("modified")) {
            this.$el.find(".alert-modified-badge").show();
            this.$el.find(".alert-working-badge").hide();
          }


          if (deployStatus == "deleting") {
            this.$el.find(".alert-working-badge").hide();
            this.$el.find(".alert-modified-badge").hide();
            this.$el.find(".alert-deleting-badge").show();
          }
        },

        showDeployLanderToDomain: function() {
          Landerds.trigger("landers:showDeployToDomain", this.model);
        },

        showAddToCampaign: function() {
          Landerds.trigger("landers:showAddToCampaign", this.model);
        },

        onBeforeRender: function() {
          var lastUpdatedRawMysqlDateTime = this.model.get("created_on");
          var timezoneName = new jstz().timezone_name;
          var formattedTime = moment.utc(lastUpdatedRawMysqlDateTime, "MMM DD, YYYY h:mm A").tz(timezoneName).format("MMM DD, YYYY h:mm A");
          this.model.set("created_on_gui", formattedTime);
        },

        expandAccordion: function() {
          this.$el.find("a:first").click();
        },

        reAlignTableHeader: function() {
          var me = this;

          //setTimeout is used to let dom set to visible to extract widths/heights!
          //run this after a very little bit so we can have the items VISIBLE!!!
          setTimeout(function() {
            //set the correct margin for the top headers
            var landersColumnWidth = me.$el.find(".table-lander-name").width();
            var newLanderLinkMargin = landersColumnWidth - 100;
            if (newLanderLinkMargin > 0) {
              me.$el.find(".deployed-domain-links-header").css("margin-left", newLanderLinkMargin);
              me.$el.find(".deployed-landers-header").show();
            } else {
              me.$el.find(".deployed-landers-header").hide();
            }

            //fade  in the headers fast
            $(".deployed-landers-header-container").show();

          }, 10);

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

          this.alertDeployStatus();

          this.reAlignTableHeader();


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
                Landerds.trigger('landers:closesidebar');
              }

              $(e.currentTarget).find("li.active").removeClass("active");
              $(e.currentTarget).find(".accordion-toggle").removeClass('active');
              $(e.currentTarget).find(".add-link-plus").hide();

            });

            this.$el.on('show.bs.collapse', function(e) {

              me.reAlignTableHeader();

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
                currentTab.find(".add-link-plus").css("display", "inline");

              } else {
                //no tab show domains tab
                var tabHandle = $(e.currentTarget).find("li.deploy-status-region");

                tabHandle.addClass("active");
                $(e.currentTarget).find("div[id^='domains-tab']").addClass("active");
                tabHandle.find(".add-link-plus").css("display", "inline");

              }


              $(e.currentTarget).find(".accordion-toggle").addClass('active')

              $(e.currentTarget).parent().find(".panel").addClass(".panel-info");

              Landerds.trigger('landers:opensidebar', me.model);

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
    return Landerds.LandersApp.Landers.List.childView;
  });
