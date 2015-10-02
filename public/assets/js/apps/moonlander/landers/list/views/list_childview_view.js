define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/templates/landers_child_item.tpl",
    "fancytree",
    "bootstrap"
  ],
 function(Moonlander, landersListItemTpl) {

  Moonlander.module("LandersApp.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.childView = Marionette.ItemView.extend({
      className: "bs-component",
      template: landersListItemTpl,

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

       

        $("#tree" + this.model.get("id")).fancytree({
          click: function(event, data) {
            var tree = $("#tree" + me.model.get("id")).fancytree("getActiveNode");
            // A node is about to be selected: prevent this, for folder-nodes:
            if (data.node.isFolder()) {
              return false;
            }
          },
          renderNode: function(event, data) {
            // Optionally tweak data.node.span
            var node = data.node;
            var $span = $(node.span);

            if ($span.hasClass("fancytree-domain")) {
              $span.find("> span.fancytree-icon").html('<img style="width: 20px;" src="/assets/img/logos/domains_icon_purple.png"/>');
            } else {
              $span.find("> span.fancytree-icon").html('<i style="font-size: 18px !important" class="fa fa-crosshairs text-system fs12 pr5"></i>');
            }

          }
        });


      }

    });
  });
  return Moonlander.LandersApp.List.childView;
});
