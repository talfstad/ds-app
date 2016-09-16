define(["app",
    "tpl!assets/js/apps/landerds/landers/list/deployed_domains/templates/deployed_domain_row.tpl",
    "assets/js/apps/landerds/base_classes/deployed_rows/views/deployed_row_base_view"
  ],
  function(Landerds, DeployedDomainRowTpl, DeployedRowBaseView) {

    Landerds.module("LandersApp.Landers.List.Deployed", function(Deployed, Landerds, Backbone, Marionette, $, _) {
      Deployed.DeployedRowView = DeployedRowBaseView.extend({

        template: DeployedDomainRowTpl,
        tagName: "tr",

        events: {
          "click .undeploy": "showRemoveDomain",
          "click .group-tab-link": "selectGroupsTab",
          "click .open-link": "openLanderLink",
          "change .lander-links-select": "updateLoadTime",
          "click .get-load-time": "getLoadTime",
          "click .goto-edit-domain": "gotoEditDomain",
          "click .copy-clipboard": function(e) {
            e.preventDefault();
            this.copyLinkToClipboard(this.getCurrentLink().link);
          }
        },

        modelEvents: {
          "change:viewIndex": "updateViewIndex",
          "change:deploy_status": "render",
          "change:load_time_spinner_gui": "setLoadTimeSpinnerState"
        },

        gotoEditDomain: function(e) {
          if (e) e.preventDefault();
          this.trigger("gotoEditDomain");
        },

        onBeforeRender: function() {
          var me = this;

          DeployedRowBaseView.prototype.onBeforeRender.apply(this);

          var activeGroupCollection = this.model.get("activeGroups");

          var hasActiveGroups = false;
          if (activeGroupCollection.length > 0) {
            activeGroupCollection.each(function(group) {

              var domainId = me.model.get("domain_id");

              //check if this deployed domain belongs to this group
              var groupDomains = group.get("domains").toJSON();
              if (groupDomains.find(function(m) {
                  var id = m.domain_id || m.id;
                  return id == domainId;
                })) {
                hasActiveGroups = true;
              }
            });
          }

          me.model.set("hasActiveGroups", hasActiveGroups);
        },

        onRender: function() {
          DeployedRowBaseView.prototype.onRender.apply(this);
        },

        showRemoveDomain: function(e) {
          e.preventDefault();

          this.trigger("showRemoveDomain", this.model);
        }
      });
    });
    return Landerds.LandersApp.Landers.List.Deployed.DeployedRowView;
  });
