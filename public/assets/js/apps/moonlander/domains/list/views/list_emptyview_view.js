define(["app",
    "tpl!assets/js/apps/moonlander/domains/list/templates/list_domains_empty.tpl"
  ],
  function(Moonlander, landersListEmptyItemsTpl) {

    Moonlander.module("DomainsApp.Domains.List", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.EmptyView = Marionette.ItemView.extend({

        template: landersListEmptyItemsTpl,

        initialize: function() {
          var me = this;
          Moonlander.loginModel.on("change:accessKeyId", function(one, two, three) {
            if (Moonlander.loginModel.get("accessKeyId")) {
              me.model.set("showAwsHelp", false);
            }
          });
        },

        modelEvents: {
          "change:showAwsHelp": "render"
        },

        onBeforeRender: function() {

          if (Moonlander.loginModel.get("accessKeyId") || Moonlander.loginModel.get("aws_access_key_id")) {
            this.model.set("showAwsHelp", false);
          } else {
            this.model.set("showAwsHelp", true);
          }

          this.model.set('filterVal', $('.lander-search').val());
          
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
    return Moonlander.DomainsApp.Domains.List.EmptyView;
  });
