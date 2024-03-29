<div class="modal-dialog modal-lg">
    <div class=" modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel"><%= group_name %></h4>
        </div>

        

        <div class="modal-body">
            <p>Are you sure you want to unattach domain <strong><%= domain_name %></strong> from group <strong><%= group_name %></strong>?</p>
        </div>
        <div class="modal-footer">
            <button type="button" data-dismiss="modal" class="btn btn-default btn-clipboard">Close</button>
            <button type="button" data-dismiss="modal" class="remove-domain-confirm btn btn-primary btn-clipboard">Unattach</button>
        </div>
    </div> 
</div>