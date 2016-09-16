define(["app",
    "tpl!assets/js/apps/landerds/domains/add_to_group/templates/groups_list.tpl",
    "bootstrap.datatables"
  ],
  function(Landerds, groupListTpl) {

    Landerds.module("DomainsApp.AddToGroup.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.View = Marionette.ItemView.extend({

        template: groupListTpl,

        initialize: function() {
          //our collection to show (which isnt tied to any other views!)
          this.datatablesCollection = this.options.datatablesCollection;

        },

        //onRender builds the datatable object with our collection
        onRender: function() {
          var me = this;
          this.$el.find('#group-list-datatable').dataTable({
            "aoColumnDefs": [{
              'bSortable': false,
              'aTargets': [-1]
            }],
            "columns": [
              { "data": "group" }
            ],
            "oLanguage": {
              "oPaginate": {
                "sPrevious": "",
                "sNext": "",
              },
              // "sSearch": "",
              "sInfo": "showing _START_ to _END_ of _TOTAL_ groups",
              "sLengthMenu": "Show _MENU_ Groups",
              "sInfoEmpty": "You currently don't have any groups",
              "sZeroRecords": "This domain already belongs to all of your groups."
            },
            //set the group id on the row so we can use it to know which to deploy to
            //in the layout view
            "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
              $(nRow).attr("data-group-id", aData.groupId);
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

          this.$el.find('#group-list-datatable tbody').on('click', 'tr', function(e) {
            if($(this).hasClass("primary")) {
              $(this).toggleClass("primary");
            } else {
              me.$el.find("tr").removeClass("primary");
              $(this).addClass("primary");
            }
          });

          var dt = this.$el.find('#group-list-datatable').DataTable();

          //loop this
          var dtRows = [];
          this.datatablesCollection.each(function(rowModel){
            var dtRow = {};
            dtRow.group = rowModel.get("name");
            dtRow.groupId = rowModel.get("id");
            dtRows.push(dtRow);
          });

          dt.rows.add(dtRows).draw(false);

        }

      });
    });
    return Landerds.DomainsApp.AddToGroup.List.View;
  });
