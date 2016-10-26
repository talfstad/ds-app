<div class="modal-dialog modal-lg">
  <div class=" modal-content">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      <h4 class="modal-title"><i style="position: relative; top: 2px; display: inline-block;" class="mr5 glyphicon glyphicon-remove-sign"></i> Report <%=name%> Broken</h4>
    </div>
    <div class="admin-form group-list-region modal-body">
      <p>If this lander <% if(ripped_from) { %>ripped<% } else { %>added<% } %> incorrectly in any way, please report it to us and we will fix it.</p>
    </div>
    <div class="modal-footer">
      <button type="button" data-dismiss="modal" class="btn btn-default btn-clipboard">Close</button>
      <button type="submit" class="report-broken-confirm btn btn-primary btn-clipboard">Report</button>
    </div>
  </div>
</div>