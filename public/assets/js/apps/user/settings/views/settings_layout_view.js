define(["app",
    "tpl!/assets/js/apps/user/settings/templates/settings_layout.tpl",
    "syphon"
  ],
  function(Moonlander, SettingsLayoutTpl) {

    Moonlander.module("UserApp.Settings", function(Settings, Moonlander, Backbone, Marionette, $, _) {

      Settings.Layout = Marionette.LayoutView.extend({

        id: "user-settings-modal",

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: SettingsLayoutTpl,

        regions: {
          'awsSettingsRegion': ".aws-settings-region"
        },

        events: {
          "click .update-aws-access-keys": "confirmUpdateAwsAccessKeys"
        },

        confirmUpdateAwsAccessKeys: function(e){
          var me = this;

          e.preventDefault();

          //key fields are valid
          var accessKeyData = Backbone.Syphon.serialize(this);
         
          //like a very little bit of validation
          if(accessKeyData.accessKeyId != "" && accessKeyData.secretAccessKey != ""){
            //save user model
            this.model.save(accessKeyData, { success: function(){

              var alert = me.$el.find(".aws-info-alert");
            
              var currentHtml = alert.html();

              alert.addClass("alert-success");
              alert.removeClass("alert-default");
              alert.html("AWS access keys have been successfully updated. We will now begin syncing to your new account.");

              setTimeout(function(){
                alert.removeClass("alert-danger").addClass("alert-default");
                alert.html(currentHtml);
              }, 10000);




            }, error: function(){} });
          } else {
            var alert = this.$el.find(".aws-info-alert");
            
            var currentHtml = alert.html();

            alert.addClass("alert-danger");
            alert.removeClass("alert-default");
            alert.html("You must enter a valid access key ID &amp; secret access key to update your access keys");

            setTimeout(function(){
              alert.removeClass("alert-danger").addClass("alert-default");
              alert.html(currentHtml);
            }, 5000);

          }
        },

        onRender: function() {
          var me = this;

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
    return Moonlander.UserApp.Settings.Layout;
  });