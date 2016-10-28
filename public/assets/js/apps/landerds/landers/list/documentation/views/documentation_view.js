define(["app",
    "assets/js/apps/landerds/base_classes/list/documentation/views/documentation_base_view"
  ],
  function(Landerds, DocumentationBaseLayout) {
    Landerds.module("LandersApp.Landers.List", function(List, Landerds, Backbone, Marionette, $, _) {

      List.DocumentationLayout = DocumentationBaseLayout.extend({

        regions: {

        },

        events: {

        },

        onBeforeRender: function() {
          DocumentationBaseLayout.prototype.onBeforeRender.apply(this);
        },

        showDeploymentFolderHelp: function() {
          this.$el.find(".list-group-item").removeClass("active");
          this.$el.find(".list-group-item.landing-pages").addClass("active");
          this.$el.find("#other-right-hand-panel-actions").tab('show');
        },

        onDomRefresh: function() {

          //select the landers tab
          $(".list-group-item").removeClass("active");
          $(".list-group-item.landing-pages").addClass("active");

          if (this.options.itemToSelect) {
            $("a[href='" + this.options.itemToSelect + "']").tab('show');
          } else {
            $("a[href='#rip-and-add-lander']").tab('show');

          }
        },

        onRender: function() {
          DocumentationBaseLayout.prototype.onRender.apply(this);
        }

      });
    });

    return Landerds.LandersApp.Landers.List.DocumentationLayout;
  });
