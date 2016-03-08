define(["app",
    "tpl!assets/js/apps/moonlander/landers/add_to_campaign/templates/campaigns_list.tpl",
    "bootstrap.datatables"
  ],
  function(Moonlander, campaignsListTpl) {

    Moonlander.module("LandersApp.AddToCampaign.List", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.View = Marionette.ItemView.extend({

        template: campaignsListTpl,

        initialize: function() {
          //our collection to show (which isnt tied to any other views!)
          this.datatablesCollection = this.options.datatablesCollection;

        },

        //onRender builds the datatable object with our collection
        onRender: function() {
          var me = this;
          this.$el.find('#campaigns-list-datatable').dataTable({
            "aoColumnDefs": [{
              'bSortable': false,
              'aTargets': [-1]
            }],
            "columns": [
              { "data": "campaign" }
            ],
            "oLanguage": {
              "oPaginate": {
                "sPrevious": "",
                "sNext": "",
              },
              // "sSearch": "",
              "sInfo": "showing _START_ to _END_ of _TOTAL_ campaigns",
              "sLengthMenu": "Show _MENU_ Campaigns",
              "sInfoEmpty": "You currently don't have any campaigns",
              "sZeroRecords": "This lander already belongs to all of your campaigns."
            },
            //set the campaign id on the row so we can use it to know which to deploy to
            //in the layout view
            "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
              $(nRow).attr("data-campaign-id", aData.campaignId);
              return nRow;
            },
            "iDisplayLength": 5,
            "aLengthMenu": [
              [5, 10, 25, 50, -1],
              [5, 10, 25, 50, "All"]
            ],

            "sDom": '<"dt-panelmenu clearfix"lfr>t<"dt-panelfooter clearfix"ip>',
            "oTableTools": {
              "sSwfPath": "vendor/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
            }
          });

          this.$el.find('#campaigns-list-datatable tbody').on('click', 'tr', function(e) {
            if($(this).hasClass("primary")) {
              $(this).toggleClass("primary");
            } else {
              me.$el.find("tr").removeClass("primary");
              $(this).addClass("primary");
            }
          });

          var dt = this.$el.find('#campaigns-list-datatable').DataTable();

          //loop this
          var dtRows = [];
          this.datatablesCollection.each(function(rowModel){
            var dtRow = {};
            dtRow.campaign = rowModel.get("name");
            dtRow.campaignId = rowModel.get("id");
            dtRows.push(dtRow);
          });

          dt.rows.add(dtRows).draw(false);


        }

      });
    });
    return Moonlander.LandersApp.AddToCampaign.List.View;
  });
