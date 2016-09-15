define(["app",
    "tpl!assets/js/apps/landerds/groups/list/templates/list_groups_empty.tpl"
  ],
  function(Landerds, landersListEmptyItemsTpl) {

    Landerds.module("GroupsApp.Groups.List.CollectionView", function(CollectionView, Landerds, Backbone, Marionette, $, _) {
      CollectionView.EmptyView = Marionette.ItemView.extend({

        template: landersListEmptyItemsTpl,

        initialize: function() {
          var me = this;
          Landerds.loginModel.on("change:accessKeyId", function(one, two, three) {
            if (Landerds.loginModel.get("accessKeyId")) {
              me.model.set("showAwsHelp", false);
            }
          });
        },

        modelEvents: {
          "change:showAwsHelp": "showSetUpAwsModal"
        },

        showSetUpAwsModal: function() {
          if (this.model.get("showAwsHelp")) {
            this.trigger("showAwsTutorial");
          }
        },

        onBeforeRender: function() {

          if (Landerds.loginModel.get("accessKeyId") || Landerds.loginModel.get("aws_access_key_id")) {
            this.model.set("showAwsHelp", false);
          } else {
            this.model.set("showAwsHelp", true);
          }

          this.model.set('filterVal', $('.list-search').val());


        },

        onRender: function() {
          this.$el.find(".fancybox")
            .attr('rel', 'gallery')
            .fancybox({
              openEffect: 'none',
              closeEffect: 'none',
              nextEffect: 'none',
              prevEffect: 'none',
              padding: 0,
              margin: [20, 60, 20, 60] // Increase left/right margin
            });
        }

      });
    });
    return Landerds.GroupsApp.Groups.List.CollectionView.EmptyView;
  });
