define(["app",
    "tpl!assets/js/apps/landerds/domains/list/templates/domains_list_row.tpl",
    "assets/js/apps/landerds/domains/list/deployed_landers/views/deployed_landers_collection_view",
    "assets/js/apps/landerds/domains/list/deployed_landers/views/deployed_landers_empty_view",
    "assets/js/apps/landerds/domains/dao/sidebar_model",
    "assets/js/apps/landerds/domains/list/views/lander_tab_handle_view",
    "assets/js/apps/landerds/domains/list/views/group_tab_handle_view",
    "assets/js/apps/landerds/domains/list/active_groups/views/active_groups_collection_view",
    "assets/js/common/notification",
    "assets/js/apps/landerds/base_classes/list/views/list_rows_base_view",
    "bootstrap",
  ],
  function(Landerds, LandersListItemTpl, DeployedListChildView, DeployedListEmptyView, SidebarModel,
    DeployStatusView, GroupsTabHandleView, ActiveGroupsView, Notification, ListRowsBaseView) {

    Landerds.module("DomainsApp.Domains.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.childView = ListRowsBaseView.extend({

        className: "bs-component accordion-group",

        template: LandersListItemTpl,
        childView: DeployedListChildView,
        emptyView: DeployedListEmptyView,
        childViewContainer: "table.deployed-landers-region",

        events: {
          "click button.add-to-group": "showAddToGroups"
        },

        modelEvents: {
          "notifyErrorDeleteDomain": "notifyErrorDeleteDomain",
          "change:deploy_status": "alertDeployStatus"
        },

        regions: {
          'lander_tab_handle_region': '.lander-tab-handle-region',
          'deployed_landers_region': '.deployed-landers-region',
          'group_tab_handle_region': '.group-tab-handle-region',
          'active_groups_region': '.active_groups_region',
          'deploy_to_new_domain_region': '.deploy-to-new-domain-region',
          'add_to_new_group_region': '.add-to-new-group-region'
        },

        initialize: function() {
          ListRowsBaseView.prototype.initialize.apply(this);
        },

        alertDeployStatus: function() {
          //show correct one
          var deployStatus = this.model.get("deploy_status");

          if (deployStatus !== "deployed" && deployStatus !== "not_deployed") {
            this.$el.find(".alert-working-badge").show();
          } else {
            this.$el.find(".alert-working-badge").hide();
          }

          if (deployStatus == "deleting") {

            this.disableAccordionPermanently();
            Landerds.trigger('domains:closesidebar');

            this.$el.find(".alert-working-badge").hide();
            this.$el.find(".alert-deleting-badge").show();
          }

        },

        showAddToGroups: function() {
          Landerds.trigger("domains:showAddToGroups", this.model);
        },

        onBeforeRender: function() {
          ListRowsBaseView.prototype.onBeforeRender.apply(this);
        },

        notifyErrorDeleteDomain: function(errorMsg) {
          Notification(this.model.get("domain"), errorMsg, "danger", "stack_top_right");
          this.model.trigger("reset");
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

            this.$el.find(".group-tab-handle-region").hover(function(e) {
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
              me.trigger('childCollapsed');

              //close right sidebar if closing all domain accordions
              if ($(e.currentTarget).find("a[data-currently-hovering='true']").length > 0) {
                Landerds.trigger('domains:closesidebar');
              }

              //hide the tab

              $(e.currentTarget).find("li.active").removeClass("active");
              $(e.currentTarget).find(".accordion-toggle").removeClass('active');
              $(e.currentTarget).find(".add-link-plus").hide();
            });

            this.$el.on('show.bs.collapse', function(e) {
              me.trigger('childExpanded');

              me.reAlignTableHeader();

              //collapse ALL others so we get an accordian effect !IMPORTANT for design
              $("#list-collection .collapse").collapse("hide");

              //disable the controls until shown (fixes multiple showing bug if clicked too fast)
              $(".accordion-toggle").addClass("inactive-link");

              //first dont show any tabs then show correct tab
              $(e.currentTarget).find("li.lander-tab-handle-region").removeClass("active");
              $(e.currentTarget).find("div[id^='landers-tab']").removeClass("active");
              $(e.currentTarget).find("li.group-tab-handle-region").removeClass("active");
              $(e.currentTarget).find("div[id^='groups-tab']").removeClass("active");
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
                var tabHandle = $(e.currentTarget).find("li.lander-tab-handle-region");
                tabHandle.addClass("active");
                tabHandle.find(".add-link-plus").css("display", "inline");

                var tab = $(e.currentTarget).find("div[id^='landers-tab']");
                tab.addClass("active");
              }

              $(e.currentTarget).find(".accordion-toggle").addClass('active')

              $(e.currentTarget).parent().find(".panel").addClass(".panel-info");

              Landerds.trigger('domains:opensidebar', me.model);

            });

            this.$el.on('shown.bs.collapse', function(e) {
              //enable the anchor tags
              $(".accordion-toggle").removeClass("inactive-link");
            });

            this.$el.find(".nav.panel-tabs").click(function(e) {
              me.reAlignTableHeader();
              $(e.currentTarget).parent().parent().find(".panel-collapse").collapse('show');
            });
          }

        }
      });
    });
    return Landerds.DomainsApp.Domains.List.childView;
  });
