define(["app",
    "tpl!/assets/js/apps/moonlander/landers/js_snippets/templates/snippet_detail.tpl",
    "vendor/bower_installed/codemirror/lib/codemirror",
    "vendor/bower_installed/codemirror/mode/htmlmixed/htmlmixed",
    "vendor/bower_installed/codemirror/mode/css/css",
    "vendor/bower_installed/codemirror/mode/javascript/javascript",
    "select2",
    "syphon"
  ],
  function(Moonlander, SnippetDetailTpl, CodeMirror) {

    Moonlander.module("LandersApp.Landers.JsSnippets.List", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.DetailView = Marionette.ItemView.extend({
        template: SnippetDetailTpl,

        initialize: function() {
          var originalCode = this.model.get("originalSnippetCode")

          if (!originalCode) {
            this.model.set("originalSnippetCode", this.model.get("code"));
          }
        },

        codeMirror: null,

        modelEvents: {
          "change:name": "render",
          "change:editing": "render",
          "change:showEditInfo": "render",
          "change:availableUrlEndpoints": "render",
          "change:saving": "render",
          "change:changed": "showAlerts",
          "change:addingToPage": "showAlerts",
          "change:savingEditInfo": "showAlerts",
          "change:savingCode": "showAlerts",
          "change:deletingSnippet": "showAlerts"
        },

        events: {
          "click .edit-snippet-button": "toggleEditingMode",
          "click .show-description-button": "toggleDescription",
          "click .change-snippet-info-button": "showEditSnippetInfo",
          "click .cancel-edit-info-button": "cancelEditSnippetInfo",
          "click .save-edit-info-button": "saveEditSnippetInfo",
          "click .add-to-lander": "addSnippetToUrlEndpoint",
          "click .reset-to-original-code-button": "resetToOriginalCode",
          "click .save-snippet-code-button": "saveSnippetCode",
          "click .delete-snippet": "deleteSnippetPrompt"
        },

        deleteSnippetPrompt: function(e) {
          this.model.set("deletingSnippet", "prompt");
        },

        deleteSnippet: function(e) {
          this.trigger("deleteSnippet");
        },

        saveSnippetCode: function(e) {
          e.preventDefault();

          var code = this.codeMirror.getValue();

          this.trigger("saveCode", code);
        },

        saveEditSnippetInfo: function(e) {
          e.preventDefault();

          //get the info from the form
          var inputVals = Backbone.Syphon.serialize(this);
          inputVals.model = this.model;
          //trigger the save
          this.trigger("saveEditInfo", inputVals);
        },

        resetToOriginalCode: function() {
          var me = this;
          var originalCode = this.model.get("originalSnippetCode");
          this.model.set("code", originalCode);

          this.codeMirror.setValue(originalCode);
          setTimeout(function() {
            me.codeMirror.refresh();

            if (!me.model.get("editing"))
              me.$el.find(".CodeMirror-line").css("opacity", ".1");

            me.model.set("changed", false);
          }, 10);

        },

        addSnippetToUrlEndpoint: function(e) {
          e.preventDefault();
          //validate we should be able to add it
          var urlEndpointId = $(".snippets-endpoint-select").val();

          if (urlEndpointId) {
            this.trigger("addSnippetToUrlEndpoint", {
              model: this.model,
              urlEndpointId: urlEndpointId
            });
          }

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

        //shows alerts on render or on change in the order of importance
        // importance levels: show longest duration ones last bc short ones will finish
        //   1. saving change to name/description
        //   2. saving snippet code
        //   3. adding to lander
        //   4. code has been changed
        setAlertType: function(className) {
          //remove all classes
          var jsAlertEl = this.$el.find(".js-snippet-alert");

          jsAlertEl.removeClass("alert-info");
          jsAlertEl.removeClass("alert-warning");
          jsAlertEl.removeClass("alert-success");
          jsAlertEl.removeClass("alert-danger");
          //add classname
          jsAlertEl.addClass(className);
        },
        showAlerts: function() {
          var me = this;
          var showAlert = false;
          var msg = "";
          var jsAlertEl = me.$el.find(".js-snippet-alert");
          var addingToPageVal = this.model.get("addingToPage");
          var savingEditInfo = this.model.get("savingEditInfo");
          var savingCode = this.model.get("savingCode");
          var codeChanged = this.model.get("changed");
          var deletingSnippet = this.model.get("deletingSnippet");

          if (deletingSnippet == "prompt") {
            showAlert = true;
            me.setAlertType("alert-danger");
            msg = "<span style='padding-left: 20px'>Are you sure you want to delete this snippet?</span>" + "<div class='btn-group' style='position: relative; margin-top: -11px; float: right'><button type='button' class='confirm-delete-snippet-button pl10 pt5 pb5 btn btn-default btn-gradient dark'>" + "<span class='fa fa-check pr5'></span>Confirm</button><button type='button' class='cancel-delete-snippet-button pl10 pt5 pb5 btn btn-default btn-gradient dark'>" + "<span class='fa fa-close pr5'></span>Cancel</button></div>";

          } else if (deletingSnippet == true) {
            showAlert = true;
            me.setAlertType("alert-danger");
            msg = "<span style='position: absolute; top: 12px' class='glyphicon mr5 glyphicon-refresh glyphicon-refresh-animate'></span><span style='padding-left: 20px'> Deleting Snippet</span>";
          
          } else if (deletingSnippet == "finished") {
            showAlert = true;
            me.setAlertType("alert-success");
            msg = "<span style='font-weight: 600'>Attention</span>: Successfully deleted snippet"
            setTimeout(function() {
              me.model.set("deletingSnippet", false);
            }, 5000);
          } else if (savingCode == true) {
            showAlert = true;
            me.setAlertType("alert-info");
            msg = "<span style='position: absolute; top: 12px' class='glyphicon mr5 glyphicon-refresh glyphicon-refresh-animate'></span><span style='padding-left: 20px'> Saving Snippet Code</span>"
          } else if (savingCode == "finished") {
            showAlert = true;
            me.setAlertType("alert-success");
            msg = "<span style='font-weight: 600'>Attention</span>: Successfully saved snippet code"
            setTimeout(function() {
              var code = me.codeMirror.getValue();
              if (code === me.model.get("code")) {
                me.model.set("changed", false);
              }
              me.model.set("savingCode", false);
            }, 5000);
          } else if (savingEditInfo == true) {
            showAlert = true;
            me.setAlertType("alert-info");
            msg = "<span style='position: absolute; top: 12px' class='glyphicon mr5 glyphicon-refresh glyphicon-refresh-animate'></span><span style='padding-left: 20px'> Saving Snippet Information</span>"
          } else if (savingEditInfo == "finished") {
            showAlert = true;
            me.setAlertType("alert-success");
            msg = "<span style='font-weight: 600'>Attention</span>: Successfully saved snippet information"
            setTimeout(function() {
              me.model.set("savingEditInfo", false);
            }, 5000);
          } else if (addingToPageVal == true) {
            showAlert = true;
            me.setAlertType("alert-info");
            msg = "<span style='position: absolute; top: 12px' class='glyphicon mr5 glyphicon-refresh glyphicon-refresh-animate'></span><span style='padding-left: 20px'> Adding Snippet to Page</span>"
          } else if (addingToPageVal == "finished") {
            showAlert = true;
            me.setAlertType("alert-success");
            msg = "<span style='font-weight: 600'>Attention</span>: Successfully added snippet to page"
            setTimeout(function() {
              me.model.set("addingToPage", false);
            }, 5000);
          } else if (codeChanged) {
            me.setAlertType("alert-warning");
            showAlert = true;
            msg = "<span style='font-weight: 600'>Attention</span>: This Snippet Code has been modified. Save your work or <a class='reset-to-original-code-button' href='#'>reset the code</a>."
          }

          //resize cm & display alert
          if (showAlert) {
            //if visible dont resize
            if (!jsAlertEl.is(":visible")) {
              var currentCmHeight = parseInt(me.$el.find(".CodeMirror").css("height"));
              me.$el.find(".js-snippet-description").css("height", currentCmHeight - 40);
              me.$el.find(".CodeMirror").css("height", currentCmHeight - 40); //40 = height of alert

              setTimeout(function() {
                me.codeMirror.refresh();

                if (!me.model.get("editing"))
                  me.$el.find(".CodeMirror-line").css("opacity", ".1");

              }, 10);
            }

            me.model.set("snippetAlertMsg", msg);
            jsAlertEl.html(msg);


            //
            jsAlertEl.fadeIn("fast", function() {
              //if prompt add listeners for button
              if (deletingSnippet == "prompt") {

                $(".cancel-delete-snippet-button").off();
                $(".cancel-delete-snippet-button").click(function(e) {
                  me.model.set("deletingSnippet", false);
                });

                $(".confirm-delete-snippet-button").off();
                $(".confirm-delete-snippet-button").click(function(e) {
                  me.deleteSnippet();
                });


              }
            });;
          } else {
            jsAlertEl.fadeOut("fast", function() {
              var height = parseInt($(".snippets-list").css("height"));
              me.$el.find(".js-snippet-description").css("height", height - 40);
              me.$el.find(".CodeMirror").css("height", height - 40); //40 = height of alert

              setTimeout(function() {
                me.codeMirror.refresh();

                if (!me.model.get("editing"))
                  me.$el.find(".CodeMirror-line").css("opacity", ".1");

              }, 10);
            });
            //disable the save bc there are no changes
            me.$el.find(".save-snippet-code-button").addClass("disabled");
          }
        },

        refreshSelect2: function() {
          var me = this;
          me.$el.find(".select2-single").select2({
            placeholder: "Select a Page",
            allowClear: false,

            "language": {
              "noResults": function() {
                return "All pages already have this snippet";
              }
            },
          });
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


          me.refreshSelect2();



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
              me.$el.find(".save-snippet-code-button").removeClass("disabled");
              me.model.set("changed", true);
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


          }, 1)

          this.showAlerts(true);

        },

        onDomRefresh: function() {
          this.refreshSelect2();
        }


      });
    });
    return Moonlander.LandersApp.Landers.JsSnippets.List.DetailView;
  });
