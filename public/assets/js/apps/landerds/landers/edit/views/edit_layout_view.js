define(["app",
    "tpl!assets/js/apps/landerds/landers/edit/templates/edit_layout.tpl",
    "syphon",
    "typewatch"
  ],
  function(Landerds, JsSnippetsLayoutTpl) {

    Landerds.module("LandersApp.Landers.JsSnippets", function(JsSnippets, Landerds, Backbone, Marionette, $, _) {

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
          'leftNavSnippetListRegion': ".snippets-list-region",
          'snippetDetailRegion': ".snippet-detail-region",
        },

        events: {
          "click .create-snippet-button": "showCreateNewSnippetView",
          "blur .editable-lander-name": "saveEditedLanderName"
        },

        saveEditedLanderName: function(e) {
          if (e) e.preventDefault();
          var me = this;

          var newLanderName = $(e.currentTarget).val();

          if (newLanderName != "" && newLanderName != this.model.get("name") && /.*[a-zA-Z0-9]+.*/.test(newLanderName)) {
            this.trigger("saveLanderName", newLanderName);
          } else {
            $(e.currentTarget).val(this.model.get("name"));
          }
        },

        showCreateNewSnippetView: function(e) {
          e.preventDefault();

          this.trigger("showCreateNewSnippetView");
        },

        onRender: function() {
          var me = this;

          this.$el.off('show.bs.modal');
          this.$el.off('shown.bs.modal');

          this.$el.on('show.bs.modal', function(e) {
            //resize width/height of modal to 80% of window
            var modalHeight = $(window).height() * 0.7;
            var modalWidth = $(window).width() * 0.8;

            //min widths
            var minWidth = 1000;
            var minHeight = 500;

            modalHeight < minHeight ? modalHeight = minHeight : null;
            modalWidth <= minWidth ? modalWidth = minWidth : null;


            me.$el.find('.modal-dialog').css('height', modalHeight);
            me.$el.find('.modal-dialog').css('width', modalWidth);



          });


          this.$el.modal('show');

        },

        filterLanders: function(filterValue) {
          this.trigger("jsSnippets:filterList", filterValue);
        },

        onClose: function() {
          this.$el.modal('hide');
        },

        onDomRefresh: function() {
          var me = this;
          var typeWatchoptions = {
            callback: function(value) {
              me.filterLanders(value);
            },
            wait: 150,
            highlight: false,
            captureLength: 1
          }

          $("#js-snippet-sidebar-search").typeWatch(typeWatchoptions);


        }
      });

    });
    return Landerds.LandersApp.Landers.JsSnippets.Layout;
  });
