<div class="modal-dialog modal-lg">
  <div class=" modal-content">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      <h4 class="modal-title"><i style="position: relative; top: 2px; display: inline-block;" class="mr5 glyphicon glyphicon-remove-sign"></i> Cancel Adding <%=name%></h4>
    </div>
    <div class="admin-form group-list-region modal-body">
    <label class="block mt15 switch switch-primary">
      <input type="checkbox" name="addError" id="add-error">
      <label for="add-error" data-on="YES" data-off="NO"></label>
      <span>Are you canceling this lander because it's taking too long?</span>
    </label>
    </div>
    <div class="modal-footer">
      <button type="button" data-dismiss="modal" class="btn btn-default btn-clipboard">Close</button>
      <button type="submit" class="cancel-add-lander-confirm btn btn-primary btn-clipboard">Cancel Add</button>
    </div>
  </div>
</div>
