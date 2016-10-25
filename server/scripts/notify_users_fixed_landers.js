var runner = function(callback) {
  _ = require("underscore-node"); // global

  var config = require("../config");
  config = config.dev; //use dev config
  var Intercom = require("intercom-client");
  var client = new Intercom.Client({ appId: config.intercom.appId, appApiKey: config.intercom.appApiKey });
  var mysql = require("mysql");

  var db = mysql.createPool(config.dbConnectionInfo);
  var dbApi = require("../db_api")({}, db);

  var module = {

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
            id: config.intercom.admin
          },
          to: {
            type: "user",
            id: intercomUserId
          }
        }

        client.messages.create(outMessage, callback);
      });
    },

    messageAlertFixedRip: function(user, lander, callback) {
      var username = user.user;
      var subject = "Your Rip is Fixed";
      var message = "The rip issue you reported has been fixed. Your lander named \"" + lander.name + "\" created on " + lander.created_on + ", ripped from " + lander.ripped_from + " should now work. Please try to re-rip your lander.";
      module.messageUser(username, subject, message, function(err) {
        if (err) {
          callback(err);
        } else {
          callback(false);
        }
      });
    },

    messageAlertFixedLander: function(user, lander, callback) {
      var username = user.user;
      var subject = "Your Lander is Fixed";
      var message = "The rip issue you reported has been fixed. Your lander named \"" + lander.name + "\" created on " + lander.created_on + " should now work. Please try to re-add your lander.";
      module.messageUser(username, subject, message, function(err) {
        if (err) {
          callback(err);
        } else {
          callback(false);
        }
      });
    }
  };


  //find the errors with fixed = true, send messages to those people, delete that row
  //module.
  dbApi.log.getFixedLanders(function(err, landers) {
    if (err) console.log("err: " + err);

    // {
    //   add: fixedAddLanders,
    //   rip: getFixedRipLanders
    // }

    var messageUser = function(lander, callback) {
      if (lander.ripped_from) {
        module.messageAlertFixedRip({ user: lander.user_email }, lander, function() {
          callback(false);
        });
      } else {
        module.messageAlertFixedLander({ user: lander.user_email }, lander, function() {
          callback(false);
        });
      }
    };

    var idx = 0;
    var totalFixed = landers.add.concat(landers.rip);
    if (totalFixed.length > 0) {
      _.each(totalFixed, function(lander) {

        console.log("\n\nlander: " + JSON.stringify(lander));

        messageUser(lander, function() {
          if (++idx == totalFixed.length) {
            dbApi.log.deleteAllFixedLanders(function() {
              console.log("messaged all users, and deleted all fixed landers and finished successfully.");
              callback();
            });
          }
        });
      });
    } else {
      console.log("no landers to update or send messages for");
      callback();
    }
  });
};

runner(function() {
  console.log("DONE done done");
  process.exit();
});
