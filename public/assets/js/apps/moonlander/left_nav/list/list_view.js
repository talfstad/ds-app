define(["app",
    "tpl!/assets/js/apps/moonlander/left_nav/list/templates/left_nav.tpl"
  ],
  function(Moonlander, leftNavTpl) {

    Moonlander.module("LeftNavApp", function(LeftNavApp, Moonlander, Backbone, Marionette, $, _) {

      LeftNavApp.LeftNav = Marionette.ItemView.extend({
        template: leftNavTpl,
        id: "sidebar_left",
        tagName: "aside",
        className: "nano nano-light affix",

        events: {
          'click #landers-left-nav a': 'goLanders',
          'click #domains-left-nav a': 'goDomains'
        },

        goDomains: function(e) {
          e.preventDefault();
          
          $(".sidebar-left-content li").removeClass("active");
          $("#domains-left-nav").addClass("active");

          this.trigger("showDomains", this.model);
        },

        goLanders: function(e) {
          e.preventDefault();
          
          $(".sidebar-left-content li").removeClass("active");
          $("#landers-left-nav img").addClass("active");

          this.trigger("showLanders", this.model);
        },



        setActiveItem: function(item){
          $(".sidebar-left-content li").removeClass("active");
          $(".sidebar-left-content li img").removeClass("active");
          $("#"+item+"-left-nav").addClass("active");
          $("#"+item+"-left-nav img").addClass("active");
        }

      });

    });

    return Moonlander.LeftNavApp.LeftNav;
  });
