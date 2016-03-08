define(["app",
    "tpl!assets/js/common/filtered_paginated/templates/paginated_buttons.tpl",
    "/assets/js/common/filtered_paginated/paginated_model.js"
    ],
  function(Moonlander, paginatedButtonsTpl, Model) {

    PaginatedButtons = Marionette.ItemView.extend({

      template: paginatedButtonsTpl,
      className: "pagination footer-content",

      modelEvents: {
        "change": "render"
      },

      onDomRefresh: function() {
        var me = this;
        $("button.first-page").click(function(e){
          e.preventDefault();
          me.trigger("firstPage");
          
        });
        $(".previous-page").click(function(e){
          e.preventDefault();
          me.trigger("previousPage");          
        });
        $(".next-page").click(function(e){
          e.preventDefault();
          me.trigger("nextPage");         
        });
        $(".last-page").click(function(e){
          e.preventDefault();
          me.trigger("lastPage");          
        });
        $(".goto-page").click(function(e){
          e.preventDefault();
          var page = $(e.currentTarget).attr("data-page");
          me.trigger("gotoPage", page);
        });
      }

    });

    return PaginatedButtons;
  });
