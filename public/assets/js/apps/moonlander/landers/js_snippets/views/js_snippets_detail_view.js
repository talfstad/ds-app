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

        codeMirror: null,

        modelEvents: {
          "change:editing": "render",
          "change:showEditInfo": "render"
        },

        events: {
          "click .edit-snippet-button": "toggleEditingMode",
          "click .show-description-button": "toggleDescription",
          "click .change-snippet-info-button": "showEditSnippetInfo",
          "click .cancel-edit-info-button": "cancelEditSnippetInfo"
        },

        cancelEditSnippetInfo: function(e) {
          e.preventDefault();
          this.model.set("showEditInfo", false);
        },

        showEditSnippetInfo: function(e) {
          e.preventDefault();
          var me = this;
          this.model.set("showEditInfo", true);
        },

        toggleEditingMode: function(e) {
          e.preventDefault();

          this.model.set({
            "editing": true
          });

          this.model.set({
            "showEditInfo": false
          }, {
            silent: true
          });
        },

        toggleDescription: function(e) {
          e.preventDefault();
          var me = this;
          if (me.model.get("changed")) {
            this.model.set("code", this.codeMirror.getValue());
          }
          this.model.set({
            "editing": false,
            "showEditInfo": false
          });
        },

        onDestroy: function() {
          //has to be silent because changing this triggers a render but this
          //is in onDestroy so we cant render shit here
          var me = this;
          if (me.model.get("changed")) {
            this.model.set({
              "code": this.codeMirror.getValue(),
              "showEditInfo": false
            }, {
              silent: true
            });
          } else {
            this.model.set("showEditInfo", false, {
              silent: true
            });
          }
        },


        onRender: function() {
          var me = this;
          var modalWidth = parseInt($(".modal-dialog").css("width"));
          var modalHeight = parseInt($(".modal-dialog").css("height"));

          var descriptionWidth = modalWidth - 229 - 3 //value is the width of the left nav - 3
          me.$el.find(".snippets-header").css("width", descriptionWidth);
          me.$el.find(".js-snippet-description").css("width", descriptionWidth);

          me.$el.find(".js-snippet-alert").css("width", descriptionWidth);

          var descriptionHeight = parseInt($(".snippets-list").css("height")) - 40;
          me.$el.find(".js-snippet-description").css("height", descriptionHeight);


          me.$el.find(".select2-single").select2({
            placeholder: "Select a Page",
            allowClear: false
          });



          var codeAreaHeight = parseInt($(".snippets-list").css("height")) - 40;
          var leftNavWidth = parseInt($("#snippets-sidebar-left").css("width")) + 1; //for a border
          var codeAreaWidth = parseInt($(".snippets-list").css("width")) - parseInt(leftNavWidth);

          me.codeMirror = CodeMirror.fromTextArea(me.$el.find(".code-area")[0], {
            lineNumbers: true,
            matchBrackets: true,
            // readOnly: "nocursor",
            mode: "javascript"
          });

          //when code changes track it and allow user to SAVE
          // when description button hit, set value to what is in codemirror
          // so when edit hit again changes arent lost
          // 

          me.codeMirror.on("change", function(cm, change) {
            if (cm.getValue().trim() !== me.model.get("code").trim()) {
              me.$el.find(".snippet-save").removeClass("disabled");
              me.model.set("changed", true);


              if (!me.model.get("hasShownCodeChangedAlert")) {
                //resize code area and show must save alert
                var msg = "<span style='font-weight: 600'>Attention</span>: This Snippet Code has been modified. Save your work or <a href='#'>reset the code</a>."
                me.model.set("snippetAlertMsg", msg);
                me.$el.find(".js-snippet-alert").html(msg)
                me.$el.find(".js-snippet-alert").fadeIn();

                var currentCmHeight = parseInt(me.$el.find(".CodeMirror").css("height"));
                me.$el.find(".CodeMirror").css("height", currentCmHeight - 40); //40 = height of alert
                me.model.set("hasShownCodeChangedAlert", true);
              }
              setTimeout(function() {
                me.codeMirror.refresh();
              }, 10);
            }
          });

          me.codeMirror.setValue(this.model.get("code"));
          //resize full height
          me.$el.find(".CodeMirror").css("height", codeAreaHeight);
          me.$el.find(".CodeMirror").css("width", codeAreaWidth);

          setTimeout(function() {
            me.codeMirror.refresh();


            if (me.model.get("editing")) {
              me.$el.find(".js-snippet-description").css("display", "none");
              me.codeMirror.focus();
            } else {
              me.$el.find(".js-snippet-description").css("display", "block");
              me.$el.find(".CodeMirror-line").css("opacity", ".1");
            }

            if (me.model.get("changed")) {
              me.$el.find(".js-snippet-alert").show();
              var currentCmHeight = parseInt(me.$el.find(".CodeMirror").css("height"));

              me.$el.find(".CodeMirror").css("height", currentCmHeight - 40);

              me.$el.find(".js-snippet-description").css("height", currentCmHeight - 40);

              setTimeout(function() {
                me.codeMirror.refresh();
              }, 10);
            }


          }, 1);

        },


      });
    });
    return Moonlander.LandersApp.Landers.JsSnippets.List.DetailView;
  });
