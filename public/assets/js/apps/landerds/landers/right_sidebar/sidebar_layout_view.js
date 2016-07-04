define(["app",
    "tpl!assets/js/apps/landerds/landers/right_sidebar/templates/sidebar_landers.tpl",
    "bootstrap",
    "highcharts",
    "highcharts-more",
    "solid-gauge"
  ],
  function(Landerds, sidebarLanders) {

    Landerds.module("LandersApp.RightSidebar", function(RightSidebar, Landerds, Backbone, Marionette, $, _) {

      RightSidebar.View = Marionette.LayoutView.extend({

        regions: {
          menuButtonsRegion: ".menu-buttons-region",
          snippetsRegion: "#jssnippets-tree",
          nameAndOptimizationsRegion: ".name-and-optimizations-region",
          landerModifiedRegion: ".lander-modified-region"
        },

        template: sidebarLanders,
        tagName: "aside",
        id: "sidebar_right",
        className: "nano affix",

        events: {
          "click button.lander-edit": "showEditLander",
          "click .delete-lander-button": "showDeleteLanderModal",
          "click .duplicate-lander-button": "showDuplicateLanderModal",
          "click .add-snippet-button": "showJsSnippetsModal",
          "click .open-preview-link": "openPreviewLink"
        },

        modelEvents: {
          "change:deploy_status": "showAlerts"
        },

        openPreviewLink: function(e) {
          e.preventDefault();

          // <aws_root_bucket>.s3-website-us-west-2.amazonaws.com/<user>/landers/<s3_folder_name>
          var rootBucket = Landerds.loginModel.get("aws_root_bucket");
          var username = Landerds.loginModel.get("username");
          var s3FolderName = this.model.get("s3_folder_name");
          var filename = $(".preview-link-endpoints-select option:selected").text().trim();
          var link = "http://" + rootBucket + ".s3-website-us-west-2.amazonaws.com/" + username + "/landers/" + s3FolderName + "/" + filename;

          window.open(link, '_blank');
          return false;

        },

        getPageSpeedLink: function() {

          // <aws_root_bucket>.s3-website-us-west-2.amazonaws.com/<user>/landers/<s3_folder_name>
          var rootBucket = Landerds.loginModel.get("aws_root_bucket");
          var username = Landerds.loginModel.get("username");
          var s3FolderName = this.model.get("s3_folder_name");
          var filename = $(".preview-link-endpoints-select option:selected").text().trim();
          var link = "http://" + rootBucket + ".s3-website-us-west-2.amazonaws.com/" + username + "/landers/" + s3FolderName + "/" + filename;
          var pageSpeedLink = "https://developers.google.com/speed/pagespeed/insights/?url=" + link;
          return pageSpeedLink;
        },

        //show modified alert if 
        showAlerts: function() {

        },

        showJsSnippetsModal: function(e) {
          Landerds.trigger("landers:showJsSnippetsModal", this.model);
        },

        showEmptyViewJsSnippetsModal: function(e) {
          Landerds.trigger("landers:showEmptyJsSnippetsModal", this.model);
        },

        showDuplicateLanderModal: function() {
          Landerds.trigger("landers:showDuplicateLanderModal", this.model.attributes);
        },

        showDeleteLanderModal: function() {
          Landerds.trigger("landers:showDeleteLanderModal", this.model);
        },

        showEditLander: function(e) {
          Landerds.trigger("landers:showEdit", this.model);
        },

        onBeforeRender: function() {
          urlEndpoints = this.model.get("urlEndpoints");
          var urlEndpointsJSON;
          if (urlEndpoints) {
            urlEndpointsJSON = urlEndpoints.toJSON();
          } else {
            urlEndpointsJSON = [];
          }
          this.model.set("urlEndpointsJSON", urlEndpointsJSON);
        },

        onRender: function() {

          this.$el.find(".preview-link-endpoints-select").select2();

          //disable open preview link if no endpoints
          if (this.model.get("urlEndpointsJSON").length <= 0) {
            this.$el.find(".open-preview-link").addClass("disabled");
          }




        },

        onDomRefresh: function() {
          var me = this;
          $("body").removeClass("external-page");

          $(".close-right-sidebar").click(function(e) {
            me.closeSidebar();
            $(".collapse").collapse('hide');
          });

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
                [0.69, '#ac311d'], // red
                [0.7, '#f8c969'], // yellow
                [0.89, '#f8c969'], // yellow
                [0.9, '#3f9532'] // green
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
              data: [13],
              dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px"><a href="'+ encodeURI(me.getPageSpeedLink()) +'" target="_blank">{y}</span></a><br/>' +
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
              data: [80],
              dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;"><a href="#"">{y}</a></span><br/>' +
                  '<span style="font-size:10px;color:rgb(102,102,102)">Optimized</span></div>'
              }
              
            }]

          }));
        },

        openSidebar: function(model) {
          var Body = $("body");
          if (!Body.hasClass('sb-r-o')) {
            Body.addClass('sb-r-o').removeClass("sb-r-c");
          }
        },

        closeSidebar: function() {
          var Body = $("body");
          // If sidebar is set to Horizontal we return
          if ($('body.sb-top').length) {
            return;
          }
          if (!Body.hasClass('sb-r-c')) {
            Body.addClass('sb-r-c').removeClass("sb-r-o");
          }
        }

      });


    });
    return Landerds.LandersApp.RightSidebar.View;
  });
