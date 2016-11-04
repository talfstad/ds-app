define(["app",
    "tpl!assets/js/apps/landerds/documentation/list/templates/documentation_list.tpl",
    "interact",
    "nanoscroller"
  ],
  function(Landerds, DocumentationTpl, interact) {
    var DocumentationContentView = Marionette.LayoutView.extend({

      id: "documentation-list",

      template: DocumentationTpl,

      events: {
        "click .toggle-help-info": "toggle"
      },

      toggle: function(e) {
        if (e) e.preventDefault();

        var target = $(".docs-container");
        target.height($("body").height() * 0.5);
        target.toggleClass("active");

        if (target.hasClass("active")) {
          //max and mins
          var maxDocumentationHeight = $('html').outerHeight() - 165;
          var minDocumentationHeight = 125;

          var newHeight = target.height();
          if (newHeight > maxDocumentationHeight) newHeight = maxDocumentationHeight;
          if (newHeight < minDocumentationHeight) newHeight = minDocumentationHeight;
          target.height(newHeight);
          $(".sidebar-left-content").height(newHeight);
          $(".documentation.nav-spy").height(newHeight);

          $("#docs-button").hide();

          //pad the content so we can still scroll it
          $("#main").css("padding-bottom", newHeight + "px");
          $(".sidebar-right-content > .panel").css("padding-bottom", newHeight + "px");

        } else {
          $("#docs-button").show();

          //remove padding for documentation
          $("#main").css("padding-bottom", "0px");
          $(".sidebar-right-content > .panel").css("padding-bottom", "0px");

        }
      },

      onBeforeRender: function() {
        // $(".list-content").addClass("documentation-content");
      },

      onDestroy: function() {
        // $(".list-content").removeClass("documentation-content");
      },

      onDomRefresh: function() {
        $(".docs-container").scrollspy({
          target: ".nav-spy",
          offset: 10
        });

        setTimeout(function() {
          $("#documentation-list .sidebar-left-content.nano").nanoScroller();
          $("#documentation-list .nav-spy.documentation.nano").nanoScroller({ stop: true });
        }, 50);

      },

      onRender: function() {
        var me = this;

        //steps left sidebar on scroll will scroll main content
        var onMousewheelStepSidebar = function(e) {
          e.preventDefault();

          //scroll the main content
          var delta = e.originalEvent.wheelDelta;
          var contentScrollTop = $(".docs-container").scrollTop();

          var scrollTop = contentScrollTop - delta;
          if (scrollTop < 0) scrollTop = 0;
          $(".docs-container").scrollTop(scrollTop)
        };

        //steps left sidebar on scroll will scroll main content
        var onMousewheelLeftSidebar = function(e) {
          e.preventDefault();

          //scroll the main content
          var delta = e.originalEvent.wheelDelta;
          var currentEl = $(e.currentTarget).find(".nano-content");
          var contentScrollTop = currentEl.scrollTop();

          var scrollTop = contentScrollTop - delta;
          if (scrollTop < 0) scrollTop = 0;
          currentEl.scrollTop(scrollTop);
        };

        //covers chrome and firefox
        this.$el.find(".left-table-of-contents").bind('DOMMouseScroll mousewheel', onMousewheelStepSidebar);
        this.$el.find("#sidebar_left").bind('DOMMouseScroll mousewheel', onMousewheelLeftSidebar);
        this.$el.find(".documentation-content-text-container").bind('DOMMouseScroll mousewheel', onMousewheelStepSidebar);
        interact('.docs-container')
          .resizable({
            preserveAspectRatio: false,
            edges: { left: false, right: false, bottom: false, top: true }
          })
          .on('resizemove', function(event) {
            var target = event.target,
              x = (parseFloat(target.getAttribute('data-x')) || 0),
              y = (parseFloat(target.getAttribute('data-y')) || 0);

            //if resized and fits the content dont show scroll bar
            $("#documentation-list .sidebar-left-content.nano").nanoScroller();

            //max and mins
            var maxDocumentationHeight = $('html').outerHeight() - 165;
            var minDocumentationHeight = 125;

            var newHeight = event.rect.height;
            if (newHeight > maxDocumentationHeight) newHeight = maxDocumentationHeight;
            if (newHeight < minDocumentationHeight) newHeight = minDocumentationHeight;

            // update the element's style
            // target.style.width = event.rect.width + 'px';
            target.style.height = newHeight + 'px';

            // translate when resizing from top or left edges
            // x += event.deltaRect.left;
            y += event.deltaRect.top;

            // target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);

            //resize the left navbars
            $(".documentation.nav-spy").css("height", newHeight + "px");
            $("#documentation-list .sidebar-left-content").css("height", newHeight + "px");

            //pad the content so we can still scroll it
            $("#main").css("padding-bottom", newHeight + "px");
            $(".sidebar-right-content > .panel").css("padding-bottom", newHeight + "px");



          });


        // Add smooth scrolling on all links inside the navbar
        this.$el.find(".nav-spy a").on('click', function(e) {

          // Make sure this.hash has a value before overriding default behavior
          if (this.hash !== "") {

            // Prevent default anchor click behavior
            e.preventDefault();


            //make relative to current scroll position
            var hash = this.hash;
            var currentScrollTop = $(".docs-container").scrollTop();
            var scrollToVal = currentScrollTop + ($(hash).position().top - 9);

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $(".docs-container").animate({
              scrollTop: scrollToVal
            }, 800, function() {

              // Add hash (#) to URL when done scrolling (default click behavior)
              // window.location.hash = hash;
            });

          }

        });


        var scrollReset = function() {
          $(".docs-container").addClass('scrolling').animate({
            scrollTop: 0
          }, 320, function() {
            $(".docs-container").removeClass('scrolling')
          });
          return false;
        };


        this.$el.find(".nav.sidebar-menu .sub-nav a").on('show.bs.tab', function() {
          //stop the left nav from refreshing (fade in) every time if div is scrolled (no idea why it refreshes w/o this)
          $(".docs-container").scrollTop(0);
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

              //if resized and fits the content dont show scroll bar
              $("#documentation-list .sidebar-left-content.nano").nanoScroller();

            });
          }
          // If the clicked menu item is a dropdown inside of a dropdown (sublevel menu)
          // we only close menu items which are not a child of the uppermost top level menu
          else {
            var activeMenu = $(this).next('ul.sub-nav');
            var siblingMenu = $(this).parent().siblings('li').children('a.accordion-toggle.menu-open').next('ul.sub-nav')

            activeMenu.slideUp('fast', 'swing', function() {
              $(this).attr('style', '').prev().removeClass('menu-open');

              //if resized and fits the content dont show scroll bar
              $("#documentation-list .sidebar-left-content.nano").nanoScroller();

            });
            siblingMenu.slideUp('fast', 'swing', function() {
              $(this).attr('style', '').prev().removeClass('menu-open');

              //if resized and fits the content dont show scroll bar
              $("#documentation-list .sidebar-left-content.nano").nanoScroller();

            });
          }

          // Now we expand targeted menu item, add the ".open-menu" class
          // and remove any left over inline jQuery animation styles
          if (!$(this).hasClass('menu-open')) {
            $(this).next('ul').slideToggle('fast', 'swing', function() {
              $(this).attr('style', '').prev().toggleClass('menu-open');

              //if resized and fits the content dont show scroll bar
              $("#documentation-list .sidebar-left-content.nano").nanoScroller();
            });
          }

        });

      }
    });
    return DocumentationContentView;
  });
