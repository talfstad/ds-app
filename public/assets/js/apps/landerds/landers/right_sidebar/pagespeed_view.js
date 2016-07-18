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

        onDomRefresh: function() {
          var me = this;
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
          $('#original-lander-pagespeed').highcharts(Highcharts.merge(gaugeOptions, {
            credits: {
              enabled: false
            },

            series: [{
              data: [66],
              dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px"><a href="' + encodeURI(me.getPageSpeedLink()) + '" target="_blank">{y}</span></a><br/>' +
                  '<span style="font-size:10px;color:rgb(102,102,102)">Original</span></div>'
              }
            }]

          }));

          // The RPM gauge
          $('#optimized-lander-pagespeed').highcharts(Highcharts.merge(gaugeOptions, {

            credits: {
              enabled: false
            },

            series: [{
              data: [90],
              dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px"><a href="' + encodeURI(me.getPageSpeedLink(true)) + '" target="_blank">{y}</span></a><br/>' +
                  '<span style="font-size:10px;color:rgb(102,102,102)">Original</span></div>'
              }

            }]

          }));
        }
      });

    });
    return Landerds.LandersApp.RightSidebar.PagespeedView;
  });
