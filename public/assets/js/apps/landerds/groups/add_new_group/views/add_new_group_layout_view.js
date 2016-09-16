define(["app",
    "tpl!assets/js/apps/landerds/groups/add_new_group/templates/add_new_group_layout.tpl",
    "bootstrap.fileinput",
    "syphon"
  ],
  function(Landerds, AddNewGroupLayoutTpl) {

    Landerds.module("GroupsApp.Groups.AddNewGroup", function(AddNewGroup, Landerds, Backbone, Marionette, $, _) {

      AddNewGroup.Layout = Marionette.LayoutView.extend({

        // id: "undeploy-lander-modal",

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: AddNewGroupLayoutTpl,

        regions: {},

        events: {
          "click .add-new-group-confirm": "confirmedAddNewGroup",
          "keyup input": "ifEnterSubmit"
        },

        ifEnterSubmit: function(e) {
          if (e.keyCode == 13) {
            this.$el.find("button[type='submit']").click();
          }
        },

        modelEvents: {
          "change:alertLoading": "alertLoading",
          "change:groupInputError": "alertEnterGroups",
          "change:groupAlreadyAdded": "alertGroupsAlreadyAdded",
          "change:groupInvalid": "alertGroupsInvalid",
          "change:alertUnknownError": "alertUnknownError"
        },

        alertLoading: function() {
          if (this.model.get("alertLoading")) {
            this.$el.find("span[data-handle='group']").text(this.model.get("name"));
            this.$el.find(".alert-loading").fadeIn();
          } else {
            this.$el.find(".alert-loading").hide();
          }
        },

        alertUnknownError: function() {
          var me = this;

          var unknownError = this.model.get("alertUnknownError");

          if (unknownError) {
            var infoAlert = this.$el.find(".aws-info-alert");
            infoAlert.hide();
            var successAlert = this.$el.find(".aws-success-alert");
            successAlert.hide();
            var defaultAlert = this.$el.find(".aws-default-alert");
            defaultAlert.hide();

            //in child view
            var adminForm = this.$el.find(".admin-form");
            adminForm.addClass("has-error");
            var errorAlert = this.$el.find(".aws-error-alert");
            errorAlert.html("We encountered an error while adding your new group. The error code is: " + this.model.get('errorCode') || "Unknown");
            errorAlert.fadeIn();
          }
        },

        alertGroupsInvalid: function() {
          var me = this;

          var groupInvalid = this.model.get("groupInvalid");

          if (groupInvalid) {
            var infoAlert = this.$el.find(".aws-info-alert");
            infoAlert.hide();
            var successAlert = this.$el.find(".aws-success-alert");
            successAlert.hide();
            var defaultAlert = this.$el.find(".aws-default-alert");
            defaultAlert.hide();

            //in child view
            var adminForm = this.$el.find(".admin-form");
            adminForm.addClass("has-error");
            var errorAlert = this.$el.find(".aws-error-alert");
            errorAlert.html("Error: You must enter a valid group name.");
            errorAlert.fadeIn();

          }
        },

        alertGroupsAlreadyAdded: function() {
          var me = this;

          var groupAlreadyAdded = this.model.get("groupAlreadyAdded");

          if (groupAlreadyAdded) {
            var infoAlert = this.$el.find(".aws-info-alert");
            infoAlert.hide();
            var successAlert = this.$el.find(".aws-success-alert");
            successAlert.hide();
            var defaultAlert = this.$el.find(".aws-default-alert");
            defaultAlert.hide();

            //in child view
            var adminForm = this.$el.find(".admin-form");
            adminForm.addClass("has-error");
            var errorAlert = this.$el.find(".aws-error-alert");
            errorAlert.html("Error: You have already added this group.");
            errorAlert.fadeIn();

          }

        },

        alertEnterGroups: function() {
          var me = this;

          var groupInputError = this.model.get("groupInputError");

          if (groupInputError) {
            var infoAlert = this.$el.find(".aws-info-alert");
            infoAlert.hide();
            var successAlert = this.$el.find(".aws-success-alert");
            successAlert.hide();
            var defaultAlert = this.$el.find(".aws-default-alert");
            defaultAlert.hide();

            //in child view
            var adminForm = this.$el.find(".admin-form");
            adminForm.addClass("has-error");
            var errorAlert = this.$el.find(".aws-error-alert");
            errorAlert.html("Error: You must enter a group name before adding it.");
            errorAlert.fadeIn();

          }

        },

        confirmedAddNewGroup: function(e) {

          var me = this;

          e.preventDefault();

          if (!this.model.get("alertLoading")) {
            //key fields are valid
            var newGroupsData = Backbone.Syphon.serialize(this);

            //just a very small amount of validation, all really done on server
            if (newGroupsData.groupName != "") {

              //1. set the new values into the job model
              this.model.set("name", newGroupsData.groupName);

              this.trigger("confirmAddGroup", this.model);

            } else {
              this.model.set("groupInputError", true);
            }
          }

        },

        onRender: function() {
          var me = this;

          this.$el.off('show.bs.modal');
          this.$el.off('shown.bs.modal');

          this.$el.on('show.bs.modal', function(e) {

          });

          this.$el.on('shown.bs.modal', function(e) {
            $(".group-name").focus();
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
    return Landerds.GroupsApp.Groups.AddNewGroup.Layout;
  });
