<div class="modal-dialog modal-lg">
	<div class=" modal-content">
    	<div class="modal-header">
    		<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    		<h4 class="modal-title"><i style="position: relative; top: 2px; display: inline-block;" class="mr5 glyphicon glyphicon-remove-sign"></i>  Delete <%= name %></h4>
    	</div>

        <div class="group-list-region modal-body">

            <p>Are you sure you want to delete <strong><%= name %></strong> permanently?</p>
                
        </div>


    	<div class="modal-footer">
            <button type="button" data-dismiss="modal" class="btn btn-default btn-clipboard">Close</button>
    		<button type="submit" class="<% if(saving_lander) { %> disabled <% } %> delete-lander-confirm btn btn-primary btn-clipboard">Delete</button>
    	</div> 
    </div>
</div>