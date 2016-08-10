define(["app",
    "tpl!assets/js/apps/landerds/landers/add_new_lander/templates/add_new_lander_layout.tpl",
    "bootstrap.fileinput",
    "syphon"
  ],
  function(Landerds, AddNewLanderLayoutTpl) {

    Landerds.module("LandersApp.Landers.AddNewLander", function(AddNewLander, Landerds, Backbone, Marionette, $, _) {

      AddNewLander.Layout = Marionette.LayoutView.extend({

        // id: "undeploy-lander-modal",

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: AddNewLanderLayoutTpl,

        regions: {},

        events: {
          "click .add-new-lander-confirm": "confirmedAddNewLander",
          "keyup input": "ifEnterSubmit"
        },

        ifEnterSubmit: function(e) {
          if (e.keyCode == 13) {
            this.$el.find("button[type='submit']").click();
          }
        },

        modelEvents: {
          "change:alertLoading": "alertLoading"
        },

        alertLoading: function() {
          if (this.model.get("alertLoading")) {
            this.$el.find(".alert-loading").fadeIn();
          } else {
            this.$el.find(".alert-loading").hide();
          }
        },

        confirmedAddNewLander: function(e) {

          var me = this;

          e.preventDefault();

          //key fields are valid
          var newLanderData = Backbone.Syphon.serialize(this);

          //on successful upload callback this function
          $("#new-lander-file").on('fileuploaded', function(e, data, previewId, index) {
            me.trigger("fileUploadComplete", data);
          });


          //weird fileupload bug for drag and drop. set the path manually
          var filename = $('.file-caption-name').attr('title');
          newLanderData.landerFile = filename;

          //just a very small amount of validation, all really done on server
          if (newLanderData.landerName != "" && filename !== undefined) {

            this.model.set("name", newLanderData.landerName);
            this.model.set("alertLoading", true);

            //trigger upload. server adds the lander to db, registers active job, and starts job
            $("#new-lander-file").fileinput("upload");

          } else {
            var alert = this.$el.find(".new-lander-info-alert");
            var adminForm = this.$el.find(".admin-form");
            var currentHtml = alert.html();

            adminForm.addClass("has-error");

            alert.addClass("alert-danger");
            alert.removeClass("alert-default");
            alert.html("You must add both a new lander name &amp; lander file to create a new lander");


            setTimeout(function() {
              adminForm.removeClass("has-error");
              alert.removeClass("alert-danger").addClass("alert-default");
              alert.html(currentHtml);
            }, 10000);

          }
        },

        onRender: function() {
          var me = this;

          this.$el.find("#new-lander-file").fileinput({
            showUpload: false,
            uploadAsync: true,
            dropZoneTitle: "Drag & drop lander here",
            fileActionSettings: {
              indicatorNew: ''
            },
            uploadExtraData: function() {
              return me.model.attributes
            },
            allowedFileExtensions: ['zip'],
            autoReplace: true,
            layoutTemplates: {
              actionUpload: '' // get rid of initial upload button action in preview
            },
            uploadUrl: "/api/landers",
            maxFileCount: 1
          });

          this.$el.off('show.bs.modal');
          this.$el.off('shown.bs.modal');

          this.$el.on('show.bs.modal', function(e) {

          });

          this.$el.on('shown.bs.modal', function(e) {
            $(".lander-name").focus();
          });

          this.$el.modal('show');

        },

        onClose: function() {
          this.$el.modal('hide');
        },
        closeModal: function() {
          this.$el.modal('hide');
        },
        onDomRefresh: function() {

        }
      });

    });
    return Landerds.LandersApp.Landers.AddNewLander.Layout;
  });
