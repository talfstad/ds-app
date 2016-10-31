define(["app", "pnotify"], function(Landerds, PNotify) {
  Landerds.notification = {};

  var stacks = {
      stack_top_right: {
        "dir1": "down",
        "dir2": "left",
        "push": "top",
        "spacing1": 10,
        "spacing2": 10
      },
      stack_top_left: {
        "dir1": "down",
        "dir2": "right",
        "push": "top",
        "spacing1": 10,
        "spacing2": 10
      },
      stack_bottom_left: {
        "dir1": "right",
        "dir2": "up",
        "push": "top",
        "spacing1": 10,
        "spacing2": 10
      },
      stack_bottom_right: {
        "dir1": "left",
        "dir2": "up",
        "push": "top",
        "spacing1": 10,
        "spacing2": 10
      },
      stack_bar_top: {
        "dir1": "down",
        "dir2": "right",
        "push": "top",
        "spacing1": 0,
        "spacing2": 0
      },
      stack_bar_bottom: {
        "dir1": "up",
        "dir2": "right",
        "spacing1": 0,
        "spacing2": 0
      },
      stack_context: {
        "dir1": "down",
        "dir2": "left",
        "context": $("#stack-context")
      },
    };

    Landerds.notification = function(title, message, style, location) {
      // A "stack" controls the direction and position
      // of a notification. Here we create an array w
      // with several custom stacks that we use later

      // PNotify Plugin Event Init
      var noteStyle = style;
      var noteShadow = true;
      // var noteOpacity = $(this).data('note-opacity');
      var noteStack = location;
      var width = "290px";

      // If notification stack or opacity is not defined set a default
      var noteStack = noteStack ? noteStack : "stack_top_right";
      var noteOpacity = noteOpacity ? noteOpacity : "1";

      // We modify the width option if the selected stack is a fullwidth style
      function findWidth() {
        if (noteStack == "stack_bar_top") {
          return "100%";
        }
        if (noteStack == "stack_bar_bottom") {
          return "70%";
        } else {
          return "290px";
        }
      }

      // Create new Notification
      new PNotify({
        title: title,
        text: message,
        shadow: noteShadow,
        mouse_reset: false,
        opacity: noteOpacity,
        addclass: noteStack,
        type: noteStyle,
        buttons: {
          closer_hover: true,
          sticker: false
        },
        stack: stacks[noteStack],
        width: findWidth(),
        delay: 5000
      });


    };
  return Landerds.notification;
});
