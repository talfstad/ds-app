<div class="modal-dialog edit-lander-modal modal-lg">
	<div class=" modal-content">
    	<div class="modal-header">
    		<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    		<h4 class="modal-title" id="myModalLabel">Undeploy <%= group_name %></h4>
    	</div>

        

    	<div class="edit-lander-modal-content modal-body">
            <p>Are you sure you want to remove the group <strong><%= group_name %></strong> from the domain <strong><%= domain_name %></strong>?</p>
        </div>
    	<div class="modal-footer">
            <button type="button" data-dismiss="modal" class="btn btn-default btn-clipboard">Close</button>
    		<button type="button" data-dismiss="modal" class="undeploy-confirm btn btn-primary btn-clipboard">Undeploy</button>
    	</div> 
    </div> 
</div>