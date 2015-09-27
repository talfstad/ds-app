define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/templates/landers_list.tpl",
    "fancytree",
    "typewatch",
    "bootstrap"
  ],
  function(Moonlander, landersListTpl) {
    Moonlander.module("LandersApp.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.Layout = Marionette.LayoutView.extend({

        template: landersListTpl,
        tagName: "section",
        id: "content_wrapper",

        regions: {
          landersCollectionRegion: "#landers-region",
        },

        events: {
          // "keyup .navbar-search input": "filterLanders"
        },

        filterLanders: function(filterValue) {
          this.trigger("landers:filterList", filterValue);
          Moonlander.trigger('landers:closesidebar');
        },

        onDomRefresh: function() {
          var me = this;

          $("body").removeClass("external-page");
          var Body = $("body");

          //fixes search bar at the top on scroll
          $('#topbar').affix({
            offset: {
              top: 60
            }
          });


          var typeWatchoptions = {
            callback: function(value) {
              me.filterLanders(value);
            },
            wait: 150,
            highlight: false,
            captureLength: 1
          }

          $(".navbar-search input").typeWatch(typeWatchoptions);

        }
      });
    });
    return Moonlander.LandersApp.List.Layout;
  });
