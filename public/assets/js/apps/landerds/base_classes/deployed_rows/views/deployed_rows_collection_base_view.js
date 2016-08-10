define(["app",
    "assets/js/common/notification"
  ],
  function(Landerds, Notification) {
    var DeployedRowsCollectionBaseView = Marionette.CollectionView.extend({

      getLoadTime: function(childView, linkObj) {

        childView.model.set("load_time_spinner_gui", true);

        //update the loading:true for this endpoint
        $.each(childView.model.get("endpoint_load_times"), function(idx, endpoint) {
          if (linkObj.url_endpoint_id == endpoint.url_endpoint_id) {
            endpoint.loading = true;
          }
        });

        childView.model.save({ load_time_data: linkObj }, {
          success: function(one, response, three) {
            var alreadyInArr = false;

            //update the correct endpoint load time in endpoint_load_times
            var endpointLoadTimes = childView.model.get("endpoint_load_times");
            $.each(endpointLoadTimes, function(idx, endpoint) {
              if (linkObj.url_endpoint_id == endpoint.url_endpoint_id) {
                alreadyInArr = true;
                endpoint.load_time = response.load_time;
                endpoint.loading = false;
              }
            });

            //check if this endpoint load time is already in the endpoint_load_times array, if not add it
            if (!alreadyInArr) {
              endpointLoadTimes.push(response);
            }

            childView.model.set("load_time_spinner_gui", false);
            childView.updateLoadTime();
          }
        });

      }

    });

    return DeployedRowsCollectionBaseView;
  });
