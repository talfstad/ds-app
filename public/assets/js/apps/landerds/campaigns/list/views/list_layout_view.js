define(["app",
    "tpl!assets/js/apps/landerds/campaigns/list/templates/campaigns_list.tpl",
    "fancytree",
    "typewatch",
    "bootstrap"
  ],
  function(Landerds, campaignsListTpl) {
    Landerds.module("CampaignsApp.Campaigns.List", function(List, Landerds, Backbone, Marionette, $, _) {

      List.Layout = Marionette.LayoutView.extend({

        template: campaignsListTpl,
        tagName: "section",
        id: "content_wrapper",

        regions: {
          campaignsCollectionRegion: "#campaigns-region",
          footerRegion: "#footer-region",
          topbarRegion: "#first-topbar"
        },

        events: {
          "click .add-new-campaign-button": "showAddNewCampaign",
          "click .toggle-help-info": "toggleHelpInfo"
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

          this.trigger("toggleInfo", this.toggle);
        },

        showAddNewCampaign: function(e) {
          e.preventDefault();
          Landerds.trigger("campaigns:showAddNewCampaignModal");
        },

        filterCampaigns: function(filterValue) {
          this.trigger("campaigns:filterList", filterValue);
          Landerds.trigger('campaigns:closesidebar');
        },

        onDomRefresh: function() {
          var me = this;


          $('input[type=radio][name=pages-radio]').change(function(e) {
            e.preventDefault();
            //pages changed update the button text
            var newPageSize = $(e.currentTarget).val();
            me.$el.find("button.rows-per-page span.rows-per-page-number").text(newPageSize);
            //call to change pagelength in collection
            me.trigger("campaigns:changepagesize", newPageSize); //TODO
          });

          var updateSortbyButtonText = function() {
            var sortbyname = me.$el.find("input[name=sort-radio]:checked").attr("data-sortby-name");
            var sortbyorder = me.$el.find(".sort-order-button-group a.active").attr('data-sortby-order');
            me.$el.find("button span.sortbyname").text(sortbyname);
            me.$el.find("button span.sortbyorder").text(sortbyorder);
          };

          $("ul.topbar li input").click(function(e) {
            updateSortbyButtonText();
            Landerds.trigger('campaigns:closesidebar');
            me.trigger("campaigns:sort");
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

            Landerds.trigger('campaigns:closesidebar');
            me.trigger("campaigns:sort");
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
              me.filterCampaigns(value);
            },
            wait: 150,
            highlight: false,
            captureLength: 1
          }

          $(".navbar-search input").typeWatch(typeWatchoptions);

        }
      });
    });
    return Landerds.CampaignsApp.Campaigns.List.Layout;
  });
