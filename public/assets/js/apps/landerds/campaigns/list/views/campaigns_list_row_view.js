define(["app",
    "tpl!assets/js/apps/landerds/campaigns/list/templates/campaigns_list_row.tpl",
    "assets/js/apps/landerds/campaigns/list/deployed_landers/views/deployed_landers_collection_view",
    "assets/js/apps/landerds/campaigns/list/deployed_landers/views/deployed_landers_empty_view",
    "assets/js/apps/landerds/campaigns/dao/sidebar_model",
    "moment-timezone",
    "assets/js/apps/landerds/campaigns/list/views/lander_tab_handle_view",
    "assets/js/apps/landerds/campaigns/list/views/domain_tab_handle_view",
    "assets/js/apps/landerds/campaigns/list/deployed_domains/views/deployed_domains_collection_view",
    "assets/js/common/notification",
    "bootstrap",
    "jstz"
  ],
  function(Landerds, LandersListItemTpl, DeployedListChildView, DeployedListEmptyView, SidebarModel, moment,
    DeployStatusView, DomainTabHandleView, ActiveCampaignsView, Notification) {

    Landerds.module("CampaignsApp.Campaigns.List.CollectionView", function(CollectionView, Landerds, Backbone, Marionette, $, _) {
      CollectionView.RowView = Marionette.LayoutView.extend({

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
        childViewContainer: "table.deployed-campaigns-region",

        modelEvents: {
          "notifySuccessDeleteCampaign": "notifySuccessDeleteCampaign",
          "notifySuccessChangeCampaignName": "notifySuccessChangeCampaignName",
          "notifyErrorDeleteCampaign": "notifyErrorDeleteCampaign",
          "change:deploy_status": "alertDeployStatus"
        },

        regions: {
          'lander_tab_handle_region': '.lander-tab-handle-region',
          'deployed_landers_region': '.deployed-landers-region',
          'domain_tab_handle_region': '.domain-tab-handle-region',
          'deployed_domains_region': '.deployed-domains-region',
          'deploy_to_new_domain_region': '.deploy-to-new-domain-region',
          'add_to_new_campaign_region': '.add-to-new-campaign-region'
        },

        alertDeployStatus: function() {
          //show correct one
          var deployStatus = this.model.get("deploy_status");

          if (deployStatus === "deleting") {
            this.$el.find(".deploy-status-text").text("Deleting...");
            this.$el.find(".alert-working-badge").show();
          } else {
            this.$el.find(".deploy-status-text").text("Working...");

            if (deployStatus !== "deployed" && deployStatus !== "not_deployed") {
              this.$el.find(".alert-working-badge").show();
            } else {
              this.$el.find(".alert-working-badge").hide();
            }
          }
        },

        onBeforeRender: function() {
          var createdOnRawMysqlDateTime = this.model.get("created_on");
          var timezoneName = new jstz().timezone_name;
          var formattedTime = moment.utc(createdOnRawMysqlDateTime, "MMM DD, YYYY h:mm A").tz(timezoneName).format("MMM DD, YYYY h:mm A");
          this.model.set("created_on_gui", formattedTime);
        },

        expandAccordion: function() {
          this.$el.find("a:first").click();
        },

        notifySuccessDeleteCampaign: function() {
          Notification(this.model.get("name"), "Successfully Deleted", "success", "stack_top_right");
        },

        notifySuccessChangeCampaignName: function() {
          Notification(this.model.get("name"), "Successfully Changed Name", "success", "stack_top_right");
        },

        notifyErrorDeleteCampaign: function(errorMsg) {
          // Notification(this.model.get("domain"), errorMsg, "danger", "stack_top_right");
          // this.model.trigger("reset");
        },

        disableAccordionPermanently: function() {
          //disable tab links
          var me = this;

          // first try collapsing it
          $("#campaigns-collection .collapse").collapse("hide");

          this.$el.find(".domain-tab-handle-region").off();
          this.$el.find(".domain-status-tab-handle").removeAttr("data-toggle");

          this.$el.find(".accordion-toggle").off();

          this.$el.find(".lander-tab-handle-region").off();
          this.$el.find(".lander-status-tab-handle").off();

          this.$el.off();

          this.$el.find(".nav.panel-tabs").off();

          this.$el.find(".accordion-toggle").click(function(e) {
            e.preventDefault();
            return false;
          });

          this.$el.find(".accordion-toggle").hover(function() {
            $(this).addClass("disabled-link");
          });

          this.$el.find("ul li").addClass("disabled");

        },

        reAlignTableHeader: function() {
          var me = this;

          setTimeout(function() {
            //set the correct margin for the top headers
            var landersColumnWidth = me.$el.find(".table-lander-name").width();
            var newLanderLinkMargin = landersColumnWidth - 70;
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


        onRender: function() {

          var me = this;

          this.alertDeployStatus();


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

            this.$el.find(".domain-tab-handle-region").hover(function(e) {
              $(e.currentTarget).attr("data-currently-hovering", true);
            }, function(e) {
              $(e.currentTarget).attr("data-currently-hovering", false);
            });

            this.$el.find(".lander-tab-handle-region").hover(function(e) {
              $(e.currentTarget).attr("data-currently-hovering", true);
            }, function(e) {
              $(e.currentTarget).attr("data-currently-hovering", false);
            });

            this.$el.on('hide.bs.collapse', function(e) {

              //hide the header so it can fade in on next open
              // $(".deployed-landers-header-container").hide();

              //close right sidebar if closing all domain accordions
              if ($(e.currentTarget).find("a[data-currently-hovering='true']").length > 0) {
                Landerds.trigger('campaigns:closesidebar');
              }

              //hide the tab

              $(e.currentTarget).find("li.active").removeClass("active");
              $(e.currentTarget).find(".accordion-toggle").removeClass('active');
              $(e.currentTarget).find(".add-link-plus").hide();
            });

            this.$el.on('show.bs.collapse', function(e) {


              //collapse ALL others so we get an accordian effect !IMPORTANT for design
              $("#campaigns-collection .collapse").collapse("hide");

              //disable the controls until shown (fixes multiple showing bug if clicked too fast)
              $(".accordion-toggle").addClass("inactive-link");

              //first dont show any tabs then show correct tab
              $(e.currentTarget).find("li.lander-tab-handle-region").removeClass("active");
              $(e.currentTarget).find("div[id^='landers-tab']").removeClass("active");
              $(e.currentTarget).find("li.domain-tab-handle-region").removeClass("active");
              $(e.currentTarget).find("div[id^='domains-tab']").removeClass("active");
              //show the correct tab
              var currentTab = $(e.currentTarget).find("li[data-currently-hovering='true']");
              var currentTabData = $("#" + currentTab.attr("data-tab-target"));
              if (currentTab.length > 0) {
                //show clicked on tab
                currentTab.addClass("active");
                currentTabData.addClass("active");
                currentTab.find(".add-link-plus").css("display", "inline");
              } else {
                //no tab show landers tab
                var tabHandle = $(e.currentTarget).find("li.lander-tab-handle-region");
                tabHandle.addClass("active");
                tabHandle.find(".add-link-plus").css("display", "inline");

                var tab = $(e.currentTarget).find("div[id^='landers-tab']");
                tab.addClass("active");

                me.reAlignTableHeader();
              }

              $(e.currentTarget).find(".accordion-toggle").addClass('active')

              $(e.currentTarget).parent().find(".panel").addClass(".panel-info");

              Landerds.trigger('campaigns:opensidebar', me.model);

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
    return Landerds.CampaignsApp.Campaigns.List.CollectionView.RowView;
  });
