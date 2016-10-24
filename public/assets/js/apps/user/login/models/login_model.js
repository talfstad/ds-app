define(["app"], function(Landerds) {
  var userSettingsModel = Backbone.Model.extend({
    urlRoot: "/api/user-settings"
  });

  var LoginModel = Backbone.Model.extend({
    urlRoot: "/api/login",

    userSettings: new userSettingsModel,

    saveUserSettings: function(callback) {
      this.userSettings.save(this.attributes, {
        success: function(one, two, three) {
          if (typeof callback == 'function') callback();
        }
      });
    },

    defaults: {
      username: "",
      password: "",
      logged_in: false,
      landers_sort_by: "lander-name",
      landers_sort_order: "asc",
      landers_rows_per_page: 10,
      groups_sort_by: "group-name",
      groups_sort_order: "asc",
      groups_rows_per_page: 10,
      domains_sort_by: "domains-name",
      domains_sort_order: "asc",
      domains_rows_per_page: 10
    },
    validation: {
      username: {
        required: true,
        msg: "is Required"
      },
      password: {
        required: true,
        msg: "is Required"
      }
    }
  });
  return LoginModel;
});
