define(["app",
    "tpl!assets/js/apps/landerds/documentation/list/templates/documentation_list.tpl",
  ],
  function(Landerds, DocumentationTpl) {
    var DocumentationContentView = Marionette.LayoutView.extend({

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

        var offset = 130;

        $("body").scrollspy({
          target: ".nav-spy",
          offset: offset
        });

        // Add smooth scrolling on all links inside the navbar
        this.$el.find(".nav-spy a").on('click', function(event) {

          // Make sure this.hash has a value before overriding default behavior
          if (this.hash !== "") {

            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;
            var titleOffset = 118;
            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
              scrollTop: ($(hash).offset().top - titleOffset)
            }, 800, function() {

              // Add hash (#) to URL when done scrolling (default click behavior)
              // window.location.hash = hash;
            });

          }

        });


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

        this.$el.find('.left-table-of-contents').affix({
          offset: {
            top: 60
          }
        });

        //listen to affix event
        $("#topbar").on("affix.bs.affix", function() {
          $(this).find(".topbar-documentation-title").fadeIn("fast");
        });

        $("#topbar").on("affix-top.bs.affix", function() {
          $(this).find(".topbar-documentation-title").hide();
        });

        this.$el.find('.return-top').on('click', function(e) {
          e.preventDefault();
          scrollReset();
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
    return DocumentationContentView;
  });
