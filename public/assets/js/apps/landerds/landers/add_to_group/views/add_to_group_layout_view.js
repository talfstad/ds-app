define(["app",
    "tpl!assets/js/apps/landerds/landers/add_to_group/templates/add_to_group_layout.tpl"
  ],
  function(Landerds, AddToGroupsLayoutTpl) {

    Landerds.module("LandersApp.Landers.AddToGroups", function(AddToGroups, Landerds, Backbone, Marionette, $, _) {

      AddToGroups.Layout = Marionette.LayoutView.extend({

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: AddToGroupsLayoutTpl,

        regions: {
          "groupsListRegion": ".groups-list-region"
        },

        modelEvents: {
          "change:saving_lander": "updateEnabledButton"
        },

        events: {
          "click .add-group-confirm": "confirmedAddGroups"
        },

        updateEnabledButton: function() {
          if (this.model.get("saving_lander")) {
            this.$el.find(".add-group-confirm").addClass("disabled");
          } else {
            this.$el.find(".add-group-confirm").removeClass("disabled");
          }
        },

        confirmedAddGroups: function() {

          //show error if no domain selected or if more than 1 is somehow selected
          var selectedRow = $("#groups-list-datatable").find("tr.primary");

          if (selectedRow.length <= 0 || selectedRow.length > 1) {
            $(".alert").addClass("alert-danger").removeClass("alert-primary");
            var currentHtml = $(".alert span").html();
            $(".alert span").html("<i class='fa fa-exclamation pr10'></i><strong>Warning:</strong> You must select a group first.");
            setTimeout(function() {
              $(".alert").removeClass("alert-danger").addClass("alert-primary");
              $(".alert span").html(currentHtml);
            }, 3000);

          } else {

            var groupId = selectedRow.attr("data-group-id");

            var groupModel = this.getRegion("groupsListRegion").currentView.datatablesCollection.find(function(m) {
              var id = m.get('group_id') || m.get('id')
              return id == groupId
            });

            this.trigger("addGroupsToLander", groupModel);
            this.$el.modal("hide");
          }
        },

        onRender: function() {
          var me = this;

          this.$el.off('show.bs.modal');
          this.$el.off('shown.bs.modal');

          this.$el.on('show.bs.modal', function(e) {


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
    return Landerds.LandersApp.Landers.AddToGroups.Layout;
  });
