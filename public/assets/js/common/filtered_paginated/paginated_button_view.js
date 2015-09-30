define(["app",
    "tpl!/assets/js/common/filtered_paginated/templates/paginated_buttons.tpl",
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
          me.trigger("landers:firstPage")          
          
        });
        $(".previous-page").click(function(e){
          e.preventDefault();
          me.trigger("landers:previousPage");          
        });
        $(".next-page").click(function(e){
          e.preventDefault();
          me.trigger("landers:nextPage");         
        });
        $(".last-page").click(function(e){
          e.preventDefault();
          me.trigger("landers:lastPage");          
        });
        $(".goto-page").click(function(e){
          e.preventDefault();
          var page = $(e.currentTarget).attr("data-page");
          me.trigger("landers:gotoPage", page);
        });
      }

    });

    return PaginatedButtons;
  });
