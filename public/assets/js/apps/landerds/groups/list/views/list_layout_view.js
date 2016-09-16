define(["app",
    "tpl!assets/js/apps/landerds/groups/list/templates/groups_list.tpl",
    "fancytree",
    "typewatch",
    "bootstrap"
  ],
  function(Landerds, groupListTpl) {
    Landerds.module("GroupsApp.Groups.List", function(List, Landerds, Backbone, Marionette, $, _) {

      List.Layout = Marionette.LayoutView.extend({

        template: groupListTpl,
        tagName: "section",
        id: "content_wrapper",

        regions: {
          groupCollectionRegion: "#groups-region",
          footerRegion: "#footer-region",
          topbarRegion: "#first-topbar"
        },

        events: {
          "click .add-new-group-button": "showAddNewGroup",
          "click .toggle-help-info": "triggerToggleHelpInfo"
        },

        toggleHelpInfo: function(e) {
          if (e) e.preventDefault();

          if (this.toggle) {
            this.$el.find(".toggle-help-info").addClass("btn-gradient").removeClass("active");
            this.toggle = false;
          } else {
            this.$el.find(".toggle-help-info").removeClass("btn-gradient").addClass("active");
            this.toggle = true;
          }
          return this.toggle;
        },

        triggerToggleHelpInfo: function(e){
          if (e) e.preventDefault();

          this.trigger("toggleInfo", this.toggle);
        },

        showAddNewGroup: function(e) {
          e.preventDefault();
          Landerds.trigger("groups:showAddNewGroupModal");
        },

        filterGroups: function(filterValue) {
          this.trigger("groups:filterList", filterValue);
          Landerds.trigger('groups:closesidebar');
        },

        onDomRefresh: function() {
          var me = this;


          $('input[type=radio][name=pages-radio]').change(function(e) {
            e.preventDefault();
            //pages changed update the button text
            var newPageSize = $(e.currentTarget).val();
            me.$el.find("button.rows-per-page span.rows-per-page-number").text(newPageSize);
            //call to change pagelength in collection
            me.trigger("groups:changepagesize", newPageSize); //TODO
          });

          var updateSortbyButtonText = function() {
            var sortbyname = me.$el.find("input[name=sort-radio]:checked").attr("data-sortby-name");
            var sortbyorder = me.$el.find(".sort-order-button-group a.active").attr('data-sortby-order');
            me.$el.find("button span.sortbyname").text(sortbyname);
            me.$el.find("button span.sortbyorder").text(sortbyorder);
          };

          $("ul.topbar li input").click(function(e) {
            updateSortbyButtonText();
            Landerds.trigger('groups:closesidebar');
            me.trigger("groups:sort");
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

            Landerds.trigger('groups:closesidebar');
            me.trigger("groups:sort");
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
              me.filterGroups(value);
            },
            wait: 150,
            highlight: false,
            captureLength: 1
          }

          $(".navbar-search input").typeWatch(typeWatchoptions);

        }
      });
    });
    return Landerds.GroupsApp.Groups.List.Layout;
  });