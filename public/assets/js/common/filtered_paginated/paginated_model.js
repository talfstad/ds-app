define(["app"],
  function(Landerds) {

    var PaginatedButtonViewModel = Backbone.Model.extend({
      defaults: {
        current_page: 1,
        num_pages: 0,
        showing_high: 0,
        showing_low: 0,
        showing_total: 0,
        total_deleting: 0,
        total_deploying: 0,
        total_initializing: 0,
        total: 0,
        total_modified: 0,
        total_not_deployed: 0,
        total_num_items: 0,
        total_undeploying: 0
      }
    });

    return PaginatedButtonViewModel;
  });
