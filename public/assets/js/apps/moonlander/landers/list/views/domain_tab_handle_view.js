define(["app",
    "tpl!assets/js/apps/moonlander/landers/list/templates/domain_tab_handle.tpl"
  ],
  function(Moonlander, domainTabHandleTpl) {

    Moonlander.module("LandersApp.Landers.List.CollectionView.RowView", function(RowView, Moonlander, Backbone, Marionette, $, _) {
      RowView.DomainTabHandle = Marionette.ItemView.extend({
        className: "domain-status-tab-handle",
        tagName: "a",
        attributes: function() {
          return {
            "href": "#domains-tab-id-" + this.model.get("id"),
            "data-toggle": "tab"
          }
        },

        template: domainTabHandleTpl,

        modelEvents: {
          "change:deployed_domains_count": "render",
        },

        events: {
          "click .add-link-plus": "addNewDomain"
        },

        addNewDomain: function(){
          Moonlander.trigger("landers:showDeployToDomain", this.model);
        },

        onRender: function() {
          var me = this;

          //on render show the plus if tab is active
          if(this.$el.parent().hasClass("active")){
            me.$el.find(".add-link-plus").css("display", "inline");
          }
          
          //remove tab capability if deleting
          if (this.model.get("deploy_status") === "deleting") {
            this.$el.removeAttr("data-toggle");
          }

          this.$el.click(function(e) {
            e.preventDefault();
          });

          this.$el.on("hide.bs.tab", function(e) {
            me.$el.find(".add-link-plus").hide();
          });

          this.$el.on("show.bs.tab", function(e) {
            me.$el.find(".add-link-plus").css("display", "inline");
          });

        }
      });
    });
    return Moonlander.LandersApp.Landers.List.CollectionView.RowView.DomainTabHandle;
  });
