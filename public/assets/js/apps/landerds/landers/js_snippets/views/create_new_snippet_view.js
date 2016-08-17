define(["app",
    "tpl!assets/js/apps/landerds/landers/js_snippets/templates/new_snippet.tpl",
    "syphon"
  ],
  function(Landerds, NewSnippetTpl) {

    Landerds.module("LandersApp.Landers.JsSnippets.List.DetailView", function(DetailView, Landerds, Backbone, Marionette, $, _) {
      DetailView.NewSnippet = Marionette.ItemView.extend({
        template: NewSnippetTpl,

        events: {
          "click .cancel-new-snippet-button": "cancelNewSnippet",
          "click .save-new-snippet-button": "saveNewSnippet"
        },

        modelEvents: {
          "change:savingNewSnippet": "showAlerts"
        },

        saveNewSnippet: function() {
          var newSnippetData = Backbone.Syphon.serialize(this);
          
          var isLoadBeforeDom = newSnippetData.loadBeforeDom;
          
          if (newSnippetData.name != "") {
            this.model.set({
              name: newSnippetData.name,
              description: newSnippetData.description,
              load_before_dom: isLoadBeforeDom,
            });
            this.trigger("saveNewSnippet");
          } else {
            this.model.set("savingNewSnippet", "error");
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
          var jsAlertEl = this.$el.find(".create-snippet-alert");

          jsAlertEl.removeClass("alert-alert");
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
          var jsAlertEl = me.$el.find(".create-snippet-alert");
          var saveSnippet = this.model.get("savingNewSnippet");

          if (saveSnippet == true) {
            showAlert = true;
            me.setAlertType("alert-alert");
            msg = "<span style='position: absolute; top: 12px' class='glyphicon mr5 glyphicon-refresh glyphicon-refresh-animate'></span><span style='padding-left: 20px'> Saving new javascript snippet</span>"
          }  else if (saveSnippet == "error") {
            showAlert = true;
            me.setAlertType("alert-danger");
            msg = "<span style='font-weight: 600'>Attention</span>: You can't add an empty snippet";
            setTimeout(function() {
              me.model.set("savingNewSnippet", false);
            }, 5000);
          }

          //resize cm & display alert
          if (showAlert) {
            me.model.set("snippetAlertMsg", msg);
            jsAlertEl.html(msg);
            jsAlertEl.fadeIn("fast");
          } else {
            jsAlertEl.fadeOut("fast");
          }
        },

        cancelNewSnippet: function() {
          this.trigger("cancelNewSnippet");
        },

        onRender: function() {
          var me = this;
          var modalWidth = parseInt($(".modal-dialog").css("width"));

          var descriptionWidth = modalWidth - 229 - 4 //value is the width of the left nav - 3
          me.$el.find(".snippets-header").css("width", descriptionWidth);
          me.$el.find(".js-snippet-description").css("width", descriptionWidth);
          me.$el.find(".alert").css("width", descriptionWidth);
        },

        onDomRefresh: function() {
          $(".new-snippet-name").focus();
        }

      });
    });
    return Landerds.LandersApp.Landers.JsSnippets.List.DetailView.NewSnippet;
  });
