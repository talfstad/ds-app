<div class="modal-dialog modal-lg">
	<div class=" modal-content">
    	<div class="modal-header">
    		<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    		<h4 class="modal-title"><span class="fa fa-trash-o pr5"></span> <%= domain %></h4>
    	</div>

        

    	<div class="campaigns-list-region modal-body">

            <p>Are you sure you want to remove <strong><%= domain %></strong>?</p>
                
        </div>


    	<div class="modal-footer">
            <button type="button" data-dismiss="modal" class="btn btn-default btn-clipboard">Close</button>
    		<button type="button" class="delete-domain-confirm btn btn-primary btn-clipboard">Delete</button>
    	</div> 
    </div>
</div>