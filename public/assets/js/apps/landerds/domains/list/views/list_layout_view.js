define(["app",
    "tpl!assets/js/apps/landerds/domains/list/templates/domains_list.tpl",
    "assets/js/apps/landerds/base_classes/list/views/list_layout_view",
    "fancytree",
    "typewatch",
    "bootstrap"
  ],
  function(Landerds, landersListTpl, ListLayoutView) {
    Landerds.module("DomainsApp.Domains.List", function(List, Landerds, Backbone, Marionette, $, _) {

      List.Layout = ListLayoutView.extend({

        template: landersListTpl,
        tagName: "section",
        id: "content_wrapper",

        toggle: false,

        regions: {
          landersCollectionRegion: "#domains-region",
          footerRegion: "#footer-region",
          topbarRegion: "#first-topbar"
        },

        events: {
          "click .add-new-domain-button": "showAddNewDomain",
          "click .toggle-help-info": "triggerToggleHelpInfo",
          "click input.search-filter-option": "updateSearchOptions"
        },

        updateSearchOptions: function(e) {
          var me = this;
          ListLayoutView.prototype.updateSearchOptions.apply(this, [e]);

          var searchCriteria = Backbone.Syphon.serialize(me.$el.find("form.navbar-search"));
          this.trigger("updateSearchFunction", searchCriteria);
          var searchVal = this.$el.find("input.list-search").val();
          this.filterDomains(searchVal || "");
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

        showAddNewDomain: function(e) {
          e.preventDefault();
          Landerds.trigger("domains:showAddNewDomainModal");
        },

        filterDomains: function(filterValue) {
          this.trigger("domains:filterList", filterValue);
          Landerds.trigger('domains:closesidebar');
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
   
        },

        onRender: function() {
          var me = this;

          var typeWatchoptions = {
            callback: function(value) {
              me.filterDomains(value);
            },
            wait: 150,
            highlight: false,
            captureLength: 1
          }

          this.$el.find(".navbar-search input").typeWatch(typeWatchoptions);

          this.$el.find(".searchclear").click(function(e) {
            e.preventDefault();
            var searchInputEl = me.$el.find(".list-search");
            searchInputEl.val('');
            searchInputEl.change();
            searchInputEl.focus();
          });

          this.$el.find(".search-dropdown").on('hide.bs.dropdown', function(e) {
            //dont close it unless not clicking within current box or search
            var curentTarget = $(e.currentTarget);
            var dropdownRect = me.$el.find("ul.search-dropdown-menu")[0].getBoundingClientRect();
            var searchRect = me.$el.find("input.list-search")[0].getBoundingClientRect();

            if (window.event) {
              if (!me.isInRect(dropdownRect) || !me.isInRect(searchRect)) {
                return false;
              } else {
                return true;
              }
            } else {
              return false;
            }
          });

          var updateSortbyButtonText = function() {
            var sortbyname = me.$el.find("input[name=sort-radio]:checked").attr("data-sortby-name");
            var sortby = me.$el.find("input[name=sort-radio]:checked").attr("data-sort-by");
            var sortbyorder = me.$el.find(".sort-order-button-group a.active").attr('data-sortby-order');
            me.$el.find("button span.sortbyname").text(sortbyname);
            me.$el.find("button span.sortbyorder").text(sortbyorder);
            Landerds.loginModel.set("domains_sort_by", sortby);
            Landerds.loginModel.set("domains_sort_order", sortbyorder.toLowerCase());
          };

          var setPageSizeText = function(newPageSize) {
            me.$el.find("button.rows-per-page span.rows-per-page-number").text(newPageSize);
            Landerds.loginModel.set("domains_rows_per_page", newPageSize);
          };

          this.$el.find("ul.topbar li label").click(function(e) {
            updateSortbyButtonText();
            Landerds.loginModel.saveUserSettings();
            me.trigger("domains:sort");
          });

          this.$el.find('.dropdown-menu .btn-group-nav a').on('click', function(e) {
            e.preventDefault();
            // Remove active class from btn-group > btns and toggle tab content
            $(this).siblings('a').removeClass('active').end().addClass('active');
            //set button text
            updateSortbyButtonText();
            Landerds.loginModel.saveUserSettings();
            me.trigger("domains:sort");
          });

          this.$el.find('input[type=radio][name=pages-radio]').change(function(e) {
            e.preventDefault();
            //pages changed update the button text
            var newPageSize = $(e.currentTarget).val();
            Landerds.loginModel.set("domains_rows_per_page", newPageSize);
            Landerds.loginModel.saveUserSettings();

            setPageSizeText(newPageSize);

            //call to change page length in collection
            me.trigger("domains:changepagesize", newPageSize);
          });

          //set the correct sort by, rows per page, sort order
          var sortEl = this.$el.find("#" + Landerds.loginModel.get("domains_sort_by"));
          sortEl.attr("checked", true);
          var sortOrderEl = this.$el.find("a[data-sort-order='" + Landerds.loginModel.get("domains_sort_order") + "']")
          sortOrderEl.siblings().removeClass("active");
          sortOrderEl.addClass("active");
          updateSortbyButtonText();

          var rowPerPageEl = this.$el.find("#" + Landerds.loginModel.get("domains_rows_per_page") + "-pages-radio");
          rowPerPageEl.attr("checked", true);
          setPageSizeText(Landerds.loginModel.get("domains_rows_per_page"));
        }
      });
    });
    return Landerds.DomainsApp.Domains.List.Layout;
  });
