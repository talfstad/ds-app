define(["app", "backbone.validation"], function(Moonlander){
  Moonlander.validation = {};

  Moonlander.validation.bindView = function(viewToBind){

    _.extend(Backbone.Validation.callbacks, {
      valid: function (view, attr, selector) {
          var $el = view.$('[name=' + attr + ']'), 
              $group = $el.closest('.form-group');
          
          $group.removeClass('has-error');
          $group.find('.help-block').html('').addClass('hidden');
      },
      invalid: function (view, attr, error, selector) {
          var $el = view.$('[name=' + attr + ']'), 
              $group = $el.closest('.form-group');
          
          $group.addClass('has-error');
          $group.find('.help-block').html(error).removeClass('hidden');
      }
    });

    Backbone.Validation.bind(viewToBind);
  };
  return Moonlander.validation;
});

