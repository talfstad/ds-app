define(["app",
    "tpl!/assets/js/apps/moonlander/landers/js_snippets/templates/js_snippets_layout.tpl",
    "vendor/bower_installed/codemirror/lib/codemirror",
    "vendor/bower_installed/codemirror/mode/htmlmixed/htmlmixed",
    "vendor/bower_installed/codemirror/mode/css/css",
    "vendor/bower_installed/codemirror/mode/javascript/javascript",
    "syphon"
  ],
  function(Moonlander, JsSnippetsLayoutTpl, CodeMirror) {

    Moonlander.module("LandersApp.JsSnippets", function(JsSnippets, Moonlander, Backbone, Marionette, $, _) {

      JsSnippets.Layout = Marionette.LayoutView.extend({

        id: "js-snippets-modal",

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: JsSnippetsLayoutTpl,

        regions: {
          // 'awsSettingsRegion': ".aws-settings-region"
        },

        events: {
          // "click .update-aws-access-keys": "confirmUpdateAwsAccessKeys"
        },


        onRender: function() {
          var me = this;

          this.$el.off('show.bs.modal');
          this.$el.off('shown.bs.modal');




          this.$el.on('show.bs.modal', function(e) {
            //resize width/height of modal to 80% of window
            var modalHeight = $( window ).height()*0.7;
            var modalWidth = $( window ).width()*0.8;

            me.$el.find('.modal-dialog').css('height', modalHeight);
            me.$el.find('.modal-dialog').css('width', modalWidth);

            var descriptionWidth = modalWidth - 229 - 3 //value is the width of the left nav - 3
            me.$el.find(".js-snippet-description").css("width", descriptionWidth);

          });



          this.$el.on('shown.bs.modal', function(e) {

            var codeAreaHeight = me.$el.find(".snippets-list").css("height");
            var leftNavWidth = me.$el.find("#snippets-sidebar-left").css("width");
            var codeAreaWidth = parseInt(me.$el.find(".snippets-list").css("width")) - parseInt(leftNavWidth);

            //set description width


            codeMirror = CodeMirror.fromTextArea(me.$el.find(".code-area")[0], {
              lineNumbers: true,
              matchBrackets: true,
              // readOnly: "nocursor",
              mode: "htmlmixed"
            });
            //resize full height
            me.$el.find(".CodeMirror").css("height", codeAreaHeight);
            me.$el.find(".CodeMirror").css("width", codeAreaWidth);
            codeMirror.refresh();


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
    return Moonlander.LandersApp.JsSnippets.Layout;
  });
