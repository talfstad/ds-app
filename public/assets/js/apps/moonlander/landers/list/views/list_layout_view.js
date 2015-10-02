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
          footerRegion: "#footer-region",
          topbarRegion: "#first-topbar"
        },

        filterLanders: function(filterValue) {
          this.trigger("landers:filterList", filterValue);
          Moonlander.trigger('landers:closesidebar');
        },

        onDomRefresh: function() {
          var me = this;


          $('input[type=radio][name=pages-radio]').change(function(e){
            e.preventDefault();
            //pages changed update the button text
            var newPageSize = $(e.currentTarget).val();
            me.$el.find("button.rows-per-page span.rows-per-page-number").text(newPageSize);
            //call to change pagelength in collection
            me.trigger("landers:changepagesize", newPageSize); //TODO
          });

          var updateSortbyButtonText = function(){
            var sortbyname = me.$el.find("input[name=sort-radio]:checked").attr("data-sortby-name");
            var sortbyorder = me.$el.find(".sort-order-button-group a.active").attr('data-sortby-order');
            me.$el.find("button span.sortbyname").text(sortbyname);
            me.$el.find("button span.sortbyorder").text(sortbyorder);
          };

          $("ul.topbar li input").click(function(e) {
            updateSortbyButtonText();
            Moonlander.trigger('landers:closesidebar');
            me.trigger("landers:sort");
          });

       

          // Prevents a dropdown menu from closing when
          // a btn-group nav menu it contains is clicked
          $('.dropdown-menu').click(function(e) {
            e.stopPropagation();
          });

          $('.dropdown-menu .btn-group-nav a').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Remove active class from btn-group > btns and toggle tab content
            $(this).siblings('a').removeClass('active').end().addClass('active');

            //set button text
            updateSortbyButtonText();

            Moonlander.trigger('landers:closesidebar');
            me.trigger("landers:sort");
          });


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
