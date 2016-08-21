define(["app",
    "assets/js/common/notification"
  ],
  function(Landerds, Notification) {
    var ListRowsBaseView = Marionette.LayoutView.extend({

      reAlignTableHeader: function() {
        var me = this;

        //setTimeout is used to let dom set to visible to extract widths/heights!
        //run this after a very little bit so we can have the items VISIBLE!!!
        setTimeout(function() {

          //get the table row width

          // get the text width

          //new margin is the difference of the widths + the text width


          //set the correct margin for the top headers
          var landersColumnWidth = me.$el.find(".table-lander-name").width();
          var textWidth = me.$el.find(".table-name-header").width();

          var padding = 15; //15px left padding on the select2 box
          var newLanderLinkMargin = (landersColumnWidth - textWidth) + padding;

          if (newLanderLinkMargin > 0) {
            me.$el.find(".deployed-domain-links-header").css("margin-left", newLanderLinkMargin);
            me.$el.find(".deployed-landers-header").show();
          } else {
            me.$el.find(".deployed-landers-header").hide();
          }

          //fade  in the headers fast
          $(".deployed-landers-header-container").show();


          //hide unneccessary columns if we're deploying/undeploying
          var deployStatus = me.model.get('deploy_status');
          if (deployStatus == "deploying" || deployStatus == "undeploying") {
            me.$el.find(".deployed-landers-header").hide();
          }

        }, 10);

      }

    });

    return ListRowsBaseView;
  });
