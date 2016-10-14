define(["app",
    "assets/js/common/notification",
    "moment-timezone",
    "jstz"
  ],
  function(Landerds, Notification, moment) {
    var ListRowsBaseView = Marionette.LayoutView.extend({

      summernoteEl: null,

      initialize: function() {
        var me = this;
        this.listenTo(this.model, "view:expand", function() {
          me.expandAccordion();
        });
      },

      destroySummernoteEditor: function() {
        var me = this;
        me.summernoteEl.summernote('destroy');
        me.summernoteEl = null;
      },

      initSummernoteEditor: function() {
        var me = this;
        if (me.summernoteEl) {
          me.destroySummernoteEditor();
        }
        var loadingHtml = '<p style="text-align: center; "><br></p><h1 style="text-align: center; "><br><br><span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span></h1>';

        me.summernoteEl = me.$el.find('.summernote');

        var saveNotes = function(context) {
          var ui = $.summernote.ui;

          // create button
          var button = ui.button({
            contents: '<i class="fa fa-save"/> Save Notes',
            click: function() {
              me.model.saveNotes(function() {
                //disable save notes
                me.disableSaveNotesIfNotChanged();
                //flash success check next to button
                var landerNotesButton = me.$el.find(".save-notes");
                var successEl = $("<i class='fa fa-check-circle text-success saved-lander-alert'></i>");
                landerNotesButton.parent().prepend(successEl);
                successEl.fadeOut('slow', function() {
                  successEl.remove();
                });
              });
            }
          });

          var returnButton = button.render().addClass("save-notes");
          return returnButton; // return button as jquery object 
        };

        //has to be shown on the dom to init summernote
        me.summernoteEl.summernote({
          height: 330, //set editable area's height
          focus: false, //set focus editable area after Initialize summernote

          callbacks: {
            onInit: function() {},
            onChange: function(contents, $editable) {
              var editableEl = me.summernoteEl.parent().find(".note-editable");
              me.model.set("notes", contents);
              var notes_search = editableEl.text();
              me.model.set("notes_search", notes_search);
              me.disableSaveNotesIfNotChanged();
            },
            onKeydown: function(e) {}
          },
          toolbar: $.extend($.summernote.options.toolbar, [
            ['insert', ['saveNotes']]
          ]),
          buttons: $.extend($.summernote.options.buttons, {
            saveNotes: saveNotes
          })
        });

        me.$el.find(".save-notes").parent().addClass("save-notes-container");

        if (me.model.get("notes")) {
          me.summernoteEl.summernote('code', me.model.get("notes"));
          me.summernoteEl.parent().find(".note-statusbar").css("display", "block");
          me.summernoteEl.summernote('enable');
          me.disableSaveNotesIfNotChanged();
        } else {
          me.summernoteEl.summernote('code', loadingHtml);
          me.summernoteEl.summernote('disable');
          me.summernoteEl.parent().find(".note-statusbar").css("display", "none");
          me.trigger("getNotes");
        }
      },

      //if this is called from the model it means view is rendered so call for a show page
      //thing which will render the collection again and show the page again.
      //if view doesnt exist this wont run bc no need to render if not rendered
      renderAndShowThisViewsPage: function() {
        this.trigger("renderAndShowThisViewsPage");
      },

      setNotesInEditor: function() {
        if (this.summernoteEl) {
          this.summernoteEl.summernote('code', this.model.get("notes") || "");
          this.summernoteEl.parent().find(".note-statusbar").css("display", "block");
          this.summernoteEl.summernote('enable');
          this.disableSaveNotesIfNotChanged();
        }
      },

      disableSaveNotesIfNotChanged: function() {
        if (this.model.get("notes") == this.model.get("server_notes")) {
          this.$el.find(".save-notes").attr("disabled", true);
        } else {
          this.$el.find(".save-notes").attr("disabled", false);
        }
      },

      stopPropagationIfReadonly: function(e) {
        if (e) {
          e.preventDefault();

          //stop propagation if this is not readonly so we can just edit it
          if (!$(e.currentTarget).attr("readonly")) {
            e.stopPropagation();
          }
        }
      },

      updateInputWidth: function(e) {
        //also checks for ENTER KEY submits if enter pressed
        var me = this;
        if (e) {
          var letterToAdd = e.key; //just care about this chars length
          var textInput = $(e.currentTarget);
          var measureWidth = textInput.parent().find(".measure-width");
          var text = textInput.val() + letterToAdd;
          //get 1 or more spaces, filter to only more than 1 space
          var spacesCount = 0;
          if ((/\S\s$/).test(text)) {
            //matches any character other than white space followed by 1 white space
            spacesCount = 1;
          }

          var oneOrMoreSpacesArr = text.match(/[ ]+/g);
          if (oneOrMoreSpacesArr) {
            $.each(oneOrMoreSpacesArr, function(i, spaces) {
              spacesCount += (spaces.length - 1);
            });
          }
          measureWidth.text(text);
          textInput.css("width", measureWidth.width() + (spacesCount * 4) + 3 + "px");
        } else {
          me.$el.find(".editable-lander-name").each(function(i, el) {
            var textInput = $(el);
            var measureWidth = textInput.parent().find(".measure-width");
            var text = textInput.val();
            var spacesCount = 0;
            var oneOrMoreSpacesArr = text.match(/[ ]+/g);
            if (oneOrMoreSpacesArr) {
              $.each(oneOrMoreSpacesArr, function(i, spaces) {
                spacesCount += (spaces.length - 1);
              });
            }
            measureWidth.text(text);
            textInput.css("width", measureWidth.width() + (spacesCount * 4) + 3 + "px");
          });
        }
      },

      onBeforeRender: function() {
        var lastUpdatedRawMysqlDateTime = this.model.get("created_on");
        var timezoneName = new jstz().timezone_name;
        var formattedTime = moment.utc(lastUpdatedRawMysqlDateTime, "MMM DD, YYYY h:mm A").tz(timezoneName).format("MMM DD, YYYY h:mm A");
        this.model.set("created_on_gui", formattedTime);
      },

      expandAccordion: function() {
        var me = this;
        setTimeout(function() {
          me.$el.find(".panel-heading").first().children().first().click();
        }, 20);
      },

      reAlignTableHeader: function(noTimeout) {
        var me = this;

        //setTimeout is used to let dom set to visible to extract widths/heights!
        //run this after a very little bit so we can have the items VISIBLE!!!

        var reAlign = function() {
          //set the correct margin for the top headers
          var landersColumnWidth = me.$el.find(".table-lander-name").width();
          var textWidth = me.$el.find(".table-name-header").width();

          var padding = 15; //15px left padding on the select2 box
          var newLanderLinkMargin = (landersColumnWidth - textWidth) + padding;

          if (newLanderLinkMargin > 0) {
            me.$el.find(".deployed-domain-links-header").css("margin-left", newLanderLinkMargin);
            me.$el.find(".deployed-landers-header").show();
          }

          //fade  in the headers fast
          $(".deployed-landers-header-container").show();
        };

        if (noTimeout) {
          reAlign();
        } else {
          setTimeout(function() {
            reAlign();
          }, 10);
        }
      },

      disableAccordionPermanently: function() {
        //disable tab links
        var me = this;

        // first try collapsing it
        $("#list-collection .collapse").collapse("hide");

        //for groups
        this.$el.find(".domain-tab-handle-region").off();
        this.$el.find(".domain-status-tab-handle").removeAttr("data-toggle");
        this.$el.find(".lander-tab-handle-region").off();
        this.$el.find(".lander-status-tab-handle").off();

        //for domains
        this.$el.find(".group-status-tab-handle").removeAttr("data-toggle");


        //for landers
        this.$el.find(".group-tab-handle-region").off();
        this.$el.find(".group-tab-handle-region a").attr("data-toggle", "");
        this.$el.find(".deploy-status-region").off();
        this.$el.find(".deploy-status-region a").attr("data-toggle", "");

        this.$el.find(".accordion-toggle").off();

        this.$el.find(".notes-tab-handle-region").off();
        this.$el.find(".notes-tab-handle-region a").attr("data-toggle", "");

        this.$el.off();
        this.$el.find(".nav.panel-tabs").off();

        this.$el.find(".accordion-toggle").click(function(e) {
          e.preventDefault();
          return false;
        });

        //disable main link
        // this.$el.find(".accordion-toggle").removeAttr("data-toggle");
        this.$el.find(".accordion-toggle").hover(function() {
          $(this).addClass("disabled-link");
        });

        this.$el.find("ul li").addClass("disabled");

      },

    });

    return ListRowsBaseView;
  });
