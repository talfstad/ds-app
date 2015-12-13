define(["app",
    "tpl!/assets/js/apps/moonlander/landers/js_snippets/templates/js_snippets_layout.tpl",
    "syphon"
  ],
  function(Moonlander, JsSnippetsLayoutTpl) {

    Moonlander.module("LandersApp.JsSnippets", function(JsSnippets, Moonlander, Backbone, Marionette, $, _) {

      JsSnippets.Layout = Marionette.LayoutView.extend({

        id: "js-snippets-modal",

        className: "modal fade",

        attrifes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: JsSnippetsLayoutTpl,

        regions: {
          'leftNavSnippetListRegion': ".snippets-list-region",
          'snippetDetailRegion': ".snippet-detail-region"
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
            var modalHeight = $(window).height() * 0.7;
            var modalWidth = $(window).width() * 0.8;

            me.$el.find('.modal-dialog').css('height', modalHeight);
            me.$el.find('.modal-dialog').css('width', modalWidth);

           

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
    return Moonlander.LandersApp.JsSnippets.Layout;
  });
