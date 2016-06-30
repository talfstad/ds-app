define(["app"],
  function(Landerds) {

  	var PaginatedButtonViewModel = Backbone.Model.extend({
      defaults: {
        num_pages: 1,
        total_num_items: 0,
        current_page: 1,
        showing_low: 1,
        showing_high: 10,
        showing_total: 10
      }
    });

    return PaginatedButtonViewModel;
  });
