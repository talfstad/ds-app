define(["app",
    "tpl!assets/js/apps/landerds/base_classes/list/documentation/templates/documentation_base.tpl",
    "smoothscroll"
  ],
  function(Landerds, DocumentationTpl) {
    var DocumentationBaseView = Marionette.LayoutView.extend({

      id: "documentation",

      template: DocumentationTpl,

      onBeforeRender: function() {
        $(".list-content").addClass("documentation-content");
      },

      onDestroy: function() {
        $(".list-content").removeClass("documentation-content");
      },

      onDomRefresh: function() {

      },

      onRender: function() {

        var scrollReset = function() {
          $("html, body").addClass('scrolling').animate({
            scrollTop: 0
          }, 320, function() {
            $("html, body").removeClass('scrolling')
          });
          return false;
        };

        this.$el.find('#sidebar_left').affix({
          offset: {
            top: 60
          }
        });

        this.$el.find('#left-table-of-contents').affix({
          offset: {
            top: 60
          }
        });

        //listen to affix event
        $("#topbar").on("affix.bs.affix", function() {



        });

        $("#topbar").on("affix-top.bs.affix", function() {



        });

        this.$el.find('.return-top').on('click', function(e) {
          e.preventDefault();
          scrollReset();
        });

        // list-group-accordion functionality
        var listAccordion = this.$el.find('.list-group-accordion');
        var accordionItems = listAccordion.find('.list-group-item');
        var accordionLink = listAccordion.find('.sign-toggle');

        accordionLink.on('click', function() {

          var accordionEl = $(this);
          var parent = accordionEl.parent();
          var children = parent.find("ul > li");

          if (!parent.hasClass("active")) {
            children.removeClass("active");
            children.first().addClass("active");
          }

        });


        // 3. LEFT MENU LINKS TOGGLE
        this.$el.find('.sidebar-menu li a.accordion-toggle').on('click', function(e) {
          e.preventDefault();

          // If the clicked menu item is minified and is a submenu (has sub-nav parent) we do nothing
          // if (!$(this).parents('ul.sub-nav').length) { return; }

          // If the clicked menu item is a dropdown we open its menu
          if (!$(this).parents('ul.sub-nav').length) {

            $('a.accordion-toggle.menu-open').next('ul').slideUp('fast', 'swing', function() {
              $(this).attr('style', '').prev().removeClass('menu-open');
            });
          }
          // If the clicked menu item is a dropdown inside of a dropdown (sublevel menu)
          // we only close menu items which are not a child of the uppermost top level menu
          else {
            var activeMenu = $(this).next('ul.sub-nav');
            var siblingMenu = $(this).parent().siblings('li').children('a.accordion-toggle.menu-open').next('ul.sub-nav')

            activeMenu.slideUp('fast', 'swing', function() {
              $(this).attr('style', '').prev().removeClass('menu-open');
            });
            siblingMenu.slideUp('fast', 'swing', function() {
              $(this).attr('style', '').prev().removeClass('menu-open');
            });
          }

          // Now we expand targeted menu item, add the ".open-menu" class
          // and remove any left over inline jQuery animation styles
          if (!$(this).hasClass('menu-open')) {
            $(this).next('ul').slideToggle('fast', 'swing', function() {
              $(this).attr('style', '').prev().toggleClass('menu-open');
            });
          }

        });





      }
    });
    return DocumentationBaseView;
  });
