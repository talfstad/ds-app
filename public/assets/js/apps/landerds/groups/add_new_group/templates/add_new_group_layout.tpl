<div class="modal-dialog modal-lg">
  <div class=" modal-content">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">Add a New Group</h4>
    </div>
    <div class="group-list-region modal-body">
      <div class="alert-loading spinner-full-container">
        <div class="modal-loading-container">
          <span class="spinner-large glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
          <h4 class="loading-text">Adding <span data-handle="group">Groups</span></h4>
        </div>
      </div>
      <div class="alert alert-micro alert-border-left alert-default aws-default-alert">
        <i class="fa fa-info pr10"></i> To add a new group just enter a name.
      </div>
      <div style="display:none;" class="alert has-error alert-micro alert-border-left alert-danger aws-error-alert"></div>
      <div class="panel panel-primary top mb35">
        <div class="panel-heading">
          <span class="panel-title">New Group Information</span>
        </div>
        <div class="panel-body bg-light dark">
          <div class="admin-form">
            <div class="section row mb10">
              <label for="groupName" class="text-align-right field-label col-md-3 text-center">Group Name:</label>
              <div class="col-md-9">
                <label for="groupName" class="field prepend-icon">
                  <input type="text" name="groupName" id="group-name" class="group-name gui-input" value="">
                  <label for="groupName" class="field-icon">
                    <i class="fa fa-sitemap"></i>
                  </label>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" data-dismiss="modal" class="btn btn-default btn-clipboard">Close</button>
      <button type="submit" class="add-new-group-confirm btn btn-primary btn-clipboard">Add Group</button>
    </div>
  </div>
</div>
