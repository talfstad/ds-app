define(["app",
    "tpl!assets/js/apps/landerds/landers/list/templates/landers_list.tpl",
    "fancytree",
    "typewatch",
    "bootstrap"
  ],
  function(Landerds, landersListTpl) {
    Landerds.module("LandersApp.Landers.List", function(List, Landerds, Backbone, Marionette, $, _) {

      List.Layout = Marionette.LayoutView.extend({

        template: landersListTpl,
        tagName: "section",
        id: "content_wrapper",

        toggle: false,

        regions: {
          landersCollectionRegion: "#landers-region",
          footerRegion: "#footer-region",
          topbarRegion: "#first-topbar"
        },

        events: {
          "click .add-new-lander-button": "showAddNewLander",
          "click .rip-and-deploy-button": "showRipNewLander",
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

        triggerToggleHelpInfo: function(e) {
          if (e) e.preventDefault();

          this.trigger("toggleInfo", this.toggle);
        },

        showRipNewLander: function(e) {
          e.preventDefault();

          if (this.toggle) {
            this.toggleHelpInfo();
          }

          Landerds.trigger("landers:showRipNewLanderModal");
        },

        showAddNewLander: function(e) {
          e.preventDefault();

          if (this.toggle) {
            this.toggleHelpInfo();
          }

          Landerds.trigger("landers:showAddNewLanderModal");
        },

        filterLanders: function(filterValue) {
          this.trigger("landers:filterList", filterValue);
          Landerds.trigger('landers:closesidebar');
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

        },

        onRender: function() {
          var me = this;

          var updateSortbyButtonText = function() {
            var sortbyname = me.$el.find("input[name=sort-radio]:checked").attr("data-sortby-name");
            var sortby = me.$el.find("input[name=sort-radio]:checked").attr("data-sort-by");
            var sortbyorder = me.$el.find(".sort-order-button-group a.active").attr('data-sortby-order');
            me.$el.find("button span.sortbyname").text(sortbyname);
            me.$el.find("button span.sortbyorder").text(sortbyorder);
            Landerds.loginModel.set("landers_sort_by", sortby);
            Landerds.loginModel.set("landers_sort_order", sortbyorder.toLowerCase());
          };

          var setPageSizeText = function(newPageSize) {
            me.$el.find("button.rows-per-page span.rows-per-page-number").text(newPageSize);
            Landerds.loginModel.set("landers_rows_per_page", newPageSize);
          };

          this.$el.find("ul.topbar li label").change(function(e) {
            updateSortbyButtonText();
            Landerds.loginModel.saveUserSettings();
            me.trigger("landers:sort");
          });

          this.$el.find('.dropdown-menu .btn-group-nav a').on('click', function(e) {
            e.preventDefault();
            // Remove active class from btn-group > btns and toggle tab content
            $(this).siblings('a').removeClass('active').end().addClass('active');
            //set button text
            updateSortbyButtonText();
            Landerds.loginModel.saveUserSettings();
            me.trigger("landers:sort");
          });

          this.$el.find('input[type=radio][name=pages-radio]').change(function(e) {
            e.preventDefault();
            //pages changed update the button text
            var newPageSize = $(e.currentTarget).val();
            Landerds.loginModel.set("landers_rows_per_page", newPageSize);
            Landerds.loginModel.saveUserSettings();

            setPageSizeText(newPageSize);

            //call to change page length in collection
            me.trigger("landers:changepagesize", newPageSize);
          });

          //set the correct sort by, rows per page, sort order
          var sortEl = this.$el.find("#" + Landerds.loginModel.get("landers_sort_by"));
          sortEl.attr("checked", true);
          var sortOrderEl = this.$el.find("a[data-sort-order='" + Landerds.loginModel.get("landers_sort_order") + "']")
          sortOrderEl.siblings().removeClass("active");
          sortOrderEl.addClass("active");
          updateSortbyButtonText();

          var rowPerPageEl = this.$el.find("#" + Landerds.loginModel.get("landers_rows_per_page") + "-pages-radio");
          rowPerPageEl.attr("checked", true);
          setPageSizeText(Landerds.loginModel.get("landers_rows_per_page"));
        }
      });
    });
    return Landerds.LandersApp.Landers.List.Layout;
  });