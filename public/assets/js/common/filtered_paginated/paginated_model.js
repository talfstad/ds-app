define(["app"],
  function(Moonlander) {

  	var PaginatedButtonViewModel = Backbone.Model.extend({
      defaults: {
        num_pages: 1
      }
    });

    return PaginatedButtonViewModel;
  });
