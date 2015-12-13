define(["app",
  "tpl!/assets/js/apps/moonlander/landers/js_snippets/templates/snippet_detail.tpl",
  "vendor/bower_installed/codemirror/lib/codemirror",
  "vendor/bower_installed/codemirror/mode/htmlmixed/htmlmixed",
  "vendor/bower_installed/codemirror/mode/css/css",
  "vendor/bower_installed/codemirror/mode/javascript/javascript",
  "select2"

],
function(Moonlander, SnippetDetailTpl, CodeMirror) {

  Moonlander.module("LandersApp.Landers.JsSnippets.List", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.DetailView = Marionette.ItemView.extend({
          template: SnippetDetailTpl,


          onRender: function() {
            var me = this;
            var modalWidth = parseInt($(".modal-dialog").css("width"));
            var modalHeight = parseInt($(".modal-dialog").css("height"));

            var descriptionWidth = modalWidth - 229 - 3 //value is the width of the left nav - 3
            me.$el.find(".snippets-header").css("width", descriptionWidth);
            me.$el.find(".js-snippet-description").css("width", descriptionWidth);

            me.$el.find(".js-snippet-alert").css("width", descriptionWidth);

            me.$el.find(".js-snippet-description").css("height", modalHeight - 160);


            me.$el.find(".select2-single").select2({
              placeholder: "Select a Page",
              allowClear: false
            });



            var codeAreaHeight = parseInt($(".snippets-list").css("height")) - 40;
            var leftNavWidth = parseInt($("#snippets-sidebar-left").css("width")) + 1; //for a border
            var codeAreaWidth = parseInt($(".snippets-list").css("width")) - parseInt(leftNavWidth);

            codeMirror = CodeMirror.fromTextArea(me.$el.find(".code-area")[0], {
              lineNumbers: true,
              matchBrackets: true,
              // readOnly: "nocursor",
              mode: "javascript"
            });
            codeMirror.setValue("\n\n\n\n\n\n\n\n");
            //resize full height
            me.$el.find(".CodeMirror").css("height", codeAreaHeight);
            me.$el.find(".CodeMirror").css("width", codeAreaWidth);

            setTimeout(function() {
              codeMirror.refresh();
            }, 10);

          // me.$el.find(".CodeMirror-line").css("opacity", ".1");
        }


      });
  });
return Moonlander.LandersApp.Landers.JsSnippets.List.DetailView;
});
