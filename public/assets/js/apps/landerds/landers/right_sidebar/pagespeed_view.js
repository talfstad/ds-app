define(["app",
    "tpl!assets/js/apps/landerds/landers/right_sidebar/templates/pagespeed.tpl",
    "highcharts",
    "highcharts-more",
    "solid-gauge"
  ],
  function(Landerds, PagespeedTpl) {

    Landerds.module("LandersApp.RightSidebar", function(RightSidebar, Landerds, Backbone, Marionette, $, _) {

      RightSidebar.PagespeedView = Marionette.ItemView.extend({
        template: PagespeedTpl,

        modelEvents: {
          "change:currentPreviewEndpointId": "render",
          "changed_pagespeed": "render"
        },

        //TODO Listen for a change of the deployedDomains collection where original_pagespeed or optimzied_pagespeed changed
        // AND render !

        getPageSpeedLink: function(optimized) {
          var folder = 'original';
          if (optimized) {
            folder = 'optimized';
          }

          // <aws_root_bucket>.s3-website-us-west-2.amazonaws.com/<user>/landers/<s3_folder_name>
          var rootBucket = Landerds.loginModel.get("aws_root_bucket");
          var username = Landerds.loginModel.get("username");
          var s3FolderName = this.model.get("s3_folder_name");
          var filename = $(".preview-link-endpoints-select option:selected").text().trim();
          var link = "http://" + rootBucket + ".s3-website-us-west-2.amazonaws.com/" + username + "/landers/" + s3FolderName + "/" + folder + "/" + filename;
          var pageSpeedLink = "https://developers.google.com/speed/pagespeed/insights/?url=" + link;
          return pageSpeedLink;
        },

        showPagespeedGraphs: function() {
          var me = this;

          var currentEndpoint = this.model.get("urlEndpoints").get(this.model.get("currentPreviewEndpointId"));

          var originalPagespeed = currentEndpoint.get("original_pagespeed");
          var optimizedPagespeed = currentEndpoint.get("optimized_pagespeed");


          var gaugeOptions = {
            credits: false,
            chart: {
              type: 'solidgauge',
              backgroundColor: 'transparent',
              marginTop: 0,
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 20
            },

            title: null,

            pane: {
              center: ['50%', '100%'],
              size: '140%',
              startAngle: -90,
              endAngle: 90,
              background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
              }
            },

            tooltip: {
              enabled: false
            },

            // the value axis
            yAxis: {
              min: 0,
              max: 100,
              stops: [
                [0.0, '#bd422e'], // red
                [0.59, '#ac311d'], // red
                [0.6, '#f8c969'], // yellow
                [0.84, '#f8c969'], // yellow
                [0.85, '#3f9532'] // green
              ],
              lineWidth: 0,
              tickmarkPlacement: 'on',
              minorTickInterval: null,
              tickPixelInterval: 400,
              tickWidth: 0,
              title: {
                text: null,
                y: -25
              },
              labels: {
                enabled: false,
                x: -20,
                y: 26
              }
            },

            plotOptions: {
              solidgauge: {
                dataLabels: {
                  y: 25,
                  borderWidth: 0,
                  useHTML: true
                }
              }
            }
          };

          // The speed gauge
          this.$el.find('#original-lander-pagespeed').highcharts(Highcharts.merge(gaugeOptions, {
            credits: {
              enabled: false
            },

            series: [{
              data: [originalPagespeed],
              dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px"><a href="' + encodeURI(me.getPageSpeedLink()) + '" target="_blank">{y}</span></a><br/>' +
                  '<span style="color:rgb(102,102,102)">Original</span></div>'
              }
            }]
          }));

          // The RPM gauge
          this.$el.find('#optimized-lander-pagespeed').highcharts(Highcharts.merge(gaugeOptions, {

            credits: {
              enabled: false
            },
            series: [{
              data: [optimizedPagespeed],
              dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px"><a href="' + encodeURI(me.getPageSpeedLink(true)) + '" target="_blank">{y}</span></a><br/>' +
                  '<span style="color:rgb(102,102,102)">Optimized</span></div>'
              }

            }]
          }));
        },

        onBeforeRender: function() {

          var me = this;

          var currentEndpoint = this.model.get("urlEndpoints").get(this.model.get("currentPreviewEndpointId"));

          //make sure lander has endpoints ..
          if (currentEndpoint) {

            var optimizationErrors = currentEndpoint.get("optimization_errors") || [];

            //format the optimization errors for GUI output
            var optimization_errors_gui = {
              pagespeedError: false,
              jsError: false,
              cssError: false
            }
           
            $.each(optimizationErrors, function(idx, error) {
              switch (error.type) {
                case "css":
                  optimization_errors_gui.cssError = true;
                  break;
                case "js":
                  optimization_errors_gui.jsError = true;
                  break;
                case "pagespeed":
                  optimization_errors_gui.pagespeedError = true;
                  break;
              }
            });

            //set optimization errors for GUI
            this.model.set("optimization_errors_gui", optimization_errors_gui);

          }



        },

        onRender: function() {
          if (this.model.get("currentPreviewEndpointId")) {
            this.showPagespeedGraphs();
          }
        }
      });

    });
    return Landerds.LandersApp.RightSidebar.PagespeedView;
  });
