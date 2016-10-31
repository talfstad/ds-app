define(["app",
    "assets/js/apps/landerds/common/notification",
    "moment-timezone",
    "jstz"
  ],
  function(Landerds, Notification, moment) {
    var listLayoutView = Marionette.LayoutView.extend({
      
      isInRect: function(rect) {
        rect.left;
        rect.right;
        rect.top;
        rect.bottom;

        var x = window.event.clientX;
        var y = window.event.clientY;

        if (x < rect.right && x > rect.left && y > rect.top && y < rect.bottom) {
          return false;
        } else {
          return true;
        }
      },

      updateSearchOptions: function(e) {
        var me = this;
        var currentTarget = $(e.currentTarget);

        //if not checked make sure at least one is or check this one back
        if (!currentTarget.is(':checked')) {
          var searchEls = this.$el.find("input.search-filter-option");
          var allowUnCheck = false;

          $.each(searchEls, function(idx, el) {
            //if not the current el
            el = $(el);
            //if one of these is checked we can allow uncheck

            if (el.is(':checked') && el.attr("id") !== currentTarget.attr("id")) {
              allowUnCheck = true;
            }
          });

          //update the value in the model and make sure the focus goes back to search box
          me.$el.find(".list-search").focus();

          if (!allowUnCheck) {
            //update the value in the model and make sure the focus goes back to search box
            //if dont allow check revert it
            e.preventDefault();
            return false;
          }
        } else {
          //update the value in the model and make sure the focus goes back to search box
          me.$el.find(".list-search").focus();
        }
      }

    });

    return listLayoutView;
  });
