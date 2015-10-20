define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/templates/landers_child_item.tpl",
    "/assets/js/apps/moonlander/landers/list/deployed/views/child_view.js",
    "/assets/js/apps/moonlander/landers/list/deployed/views/empty_view.js",
    "bootstrap"
  ],
 function(Moonlander, LandersListItemTpl, DeployedListChildView, DeployedListEmptyView) {

  Moonlander.module("LandersApp.Landers.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.childView = Marionette.CompositeView.extend({
      className: "bs-component",

      template: LandersListItemTpl,
      childView: DeployedListChildView,
      emptyView: DeployedListEmptyView,
      childViewContainer: "table.deployed-domains-region",

      initialize: function() {
        //set collection to subset of parent collection (from collectionview)
        this.collection = this.model.deployedLocations;
      },

      //pass the deployed list its rendered index for # column
      childViewOptions: function(model) {
        model.set('viewIndex', parseInt(this.collection.indexOf(model))+1);
        model.set('urlEndpoints', this.model.get("urlEndpoints"));
        model.set('landerName', this.model.get("name")); //give child access to lander name
        // model.set('lander_id', this.model.get("id")); //give child access to lander id
      },

      onRender: function(){
        var me = this;

        this.$el.on('hide.bs.collapse', function(e) {
          //close right sidebar if closing all domain accordions
          if ($(".collapse-in").length <= 1) {
            Moonlander.trigger('landers:closesidebar');
          }

          $(e.currentTarget).find("li.active").removeClass("active");
          $(e.currentTarget).find(".accordion-toggle").removeClass('active')

        });

        this.$el.on('show.bs.collapse', function(e) {
            //collapse ALL others so we get an accordian effect !IMPORTANT for design
            $(".collapse").collapse('hide');

            $(e.currentTarget).find("li:first").addClass("active");
            $(e.currentTarget).find(".accordion-toggle").addClass('active')

            $(e.currentTarget).parent().find(".panel").addClass(".panel-info");


            Moonlander.trigger('landers:opensidebar', me.model);

          });

         this.$el.find(".nav.panel-tabs").click(function(e) {
            $(e.currentTarget).parent().parent().find(".panel-collapse").collapse('show');
          });

         this.$el.find(".domain-link").click(function(e) {
          //get the val from select box
          var domainEndpointSelectValue = $(e.currentTarget).parent().find("select").val();
          var domainLinkHref = $(e.currentTarget).text();
          //go to the full page
          $(e.currentTarget).attr("href", "http://" + domainLinkHref + domainEndpointSelectValue);
        });

         this.$el.find(".domain-link").hover(function(e) {
          //get next select
          var domainEndpointSelect = $(e.currentTarget).parent().find("select");

          //underline it or undo underline if already applied
          if (domainEndpointSelect.hasClass("domain-link-hover")) {
            domainEndpointSelect.removeClass("domain-link-hover");
          } else {
            domainEndpointSelect.addClass("domain-link-hover");
          }
         });

      },

      onDomRefresh: function() {
        var me = this;

        //needed to init correctly. avoids initial toggle on button click (expand/collapse all)
        $(".collapse").collapse({
          toggle: false
        });
      }

    });
  });
  return Moonlander.LandersApp.Landers.List.childView;
});
