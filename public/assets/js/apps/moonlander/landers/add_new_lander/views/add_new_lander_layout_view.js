define(["app",
    "tpl!/assets/js/apps/moonlander/landers/add_new_lander/templates/add_new_lander_layout.tpl",
    "bootstrap.fileinput",
    "syphon"
  ],
  function(Moonlander, AddNewLanderLayoutTpl) {

    Moonlander.module("LandersApp.Landers.AddNewLander", function(AddNewLander, Moonlander, Backbone, Marionette, $, _) {

      AddNewLander.Layout = Marionette.LayoutView.extend({

        // id: "undeploy-lander-modal",

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: AddNewLanderLayoutTpl,

        regions: {
        },

        events: {
          "click .add-new-lander-confirm": "confirmedAddNewLander"
        },

        confirmedAddNewLander: function(e) {

           var me = this;

          e.preventDefault();

          //key fields are valid
          var newLanderData = Backbone.Syphon.serialize(this);

          //on successful upload callback this function
          $("#new-lander-file").on('fileuploaded', function(e, data, previewId, index){


            //// server returns job id, lander id
            //2. create new jobmodel with jobid and action and lander id
            //3. create a new lander model
            //4. add jobmodel to lander model
            //5. trigger add lander model on the landers collection


          });

          //just a very small amount of validation, all really done on server
          if(newLanderData.landerName != "" && newLanderData.landerFile != ""){
  
            this.model.set("landerName", newLanderData.landerName);
           
            //////save lander & add to collection

            //1. trigger upload. server adds the lander to db, registers active job, and starts job
            $("#new-lander-file").fileinput("upload");

          } else {
            var alert = this.$el.find(".new-lander-info-alert");
            var adminForm = this.$el.find(".admin-form");            
            var currentHtml = alert.html();

            adminForm.addClass("has-error");

            alert.addClass("alert-danger");
            alert.removeClass("alert-default");
            alert.html("You must add both a new lander name &amp; lander file to create a new lander");


            setTimeout(function(){
              adminForm.removeClass("has-error");
              alert.removeClass("alert-danger").addClass("alert-default");
              alert.html(currentHtml);
            }, 10000);

          }
        },

        onRender: function() {
          var me = this;

          this.$el.find("#new-lander-file").fileinput({
            showUpload:false,
            uploadAsync: true,
            dropZoneTitle: "Drag & drop lander here",
            fileActionSettings: {
              indicatorNew: ''
            },
            uploadExtraData: function(){
              return me.model.attributes
            },
            allowedFileExtensions: ['zip'],
            autoReplace: true,
            layoutTemplates: {
              actionUpload: '' // get rid of initial upload button action in preview
            },
            uploadUrl: "/api/jobs",
            maxFileCount: 1
          });

          this.$el.off('show.bs.modal');
          this.$el.off('shown.bs.modal');

          this.$el.on('show.bs.modal', function(e){
          
           
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
    return Moonlander.LandersApp.Landers.AddNewLander.Layout;
  });