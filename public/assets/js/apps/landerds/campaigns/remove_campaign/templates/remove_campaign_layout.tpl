<div class="modal-dialog edit-lander-modal modal-lg">
    <div class=" modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel"><%= name %></h4>
        </div>

        

        <div class="edit-lander-modal-content modal-body">
            <p>Are you sure you want to delete campaign <strong><%= name %></strong>?</p>
        </div>
        <div class="modal-footer">
            <button type="button" data-dismiss="modal" class="btn btn-default btn-clipboard">Close</button>
            <button type="button" data-dismiss="modal" class="remove-campaign-confirm btn btn-primary btn-clipboard">Delete</button>
        </div>
    </div> 
</div>