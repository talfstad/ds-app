module.exports = function(app, dbApi) {

  var Intercom = require("intercom-client");
  var client = new Intercom.Client({ appId: app.config.intercom.appId, appApiKey: app.config.intercom.appApiKey });

  var module = _.extend({

    messageUser: function(email, messageSubject, messageText, callback) {
      client.users.find({ email: email }, function(user) {

        var intercomUserId = user.body.id;

        var outMessage = {
          message_type: "inapp",
          subject: messageSubject,
          body: messageText,
          template: "plain",
          from: {
            type: "admin",
            id: app.config.intercom.admin
          },
          to: {
            type: "user",
            id: intercomUserId
          }
        }

        client.messages.create(outMessage, callback);
      });
    },

    messageAlertFixingRip: function(user, callback) {
      var username = user.user;
      var subject = "Hey!";
      var message = "Thanks for reporting this rip broken. We’re looking into it, and I’ll message you when the issue is fixed!";
      module.messageUser(username, subject, message, function(err) {
        if (err) {
          callback(err);
        } else {
          callback(false);
        }
      });
    },

    messageAlertFixingLander: function(user, callback) {
      var username = user.user;
      var subject = "Hey";
      var message = "Thanks for reporting this add lander broken. We’re looking into it, and I’ll message you when the issue is fixed!";
      module.messageUser(username, subject, message, function(err) {
        if (err) {
          callback(err);
        } else {
          callback(false);
        }
      });
    }
  }, {});

  return module;
};
