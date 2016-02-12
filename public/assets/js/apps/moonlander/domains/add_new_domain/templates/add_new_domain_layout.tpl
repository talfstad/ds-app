<div class="modal-dialog modal-lg">
  <div class=" modal-content">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">Add a New Domain</h4>
    </div>
    <div class="campaigns-list-region modal-body">
      <div class="alert-loading spinner-full-container">
        <div class="modal-loading-container">
          <span class="spinner-large glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
          <h4 class="loading-text">Adding <span data-handle="domain">Domain</span></h4>
        </div>
      </div>
      <div class="alert alert-micro alert-border-left alert-default new-domain-info-alert">
        <i class="fa fa-info pr10"></i> To add a new domain just enter it's URL. Have questions? <a href="#" class="alert-link">Check out this step by step guide.</a>
      </div>
      <div style="display:none;" class="alert has-error alert-micro alert-border-left alert-danger new-domain-error-alert"></div>
      <div class="panel panel-primary top mb35">
        <div class="panel-heading">
          <span class="panel-title">New Domain Information</span>
        </div>
        <div class="panel-body bg-light dark">
          <div class="admin-form">
            <div class="section row mb10">
              <label for="domainName" class="text-align-right field-label col-md-3 text-center">Domain Name:</label>
              <div class="col-md-9">
                <label for="domainName" class="field prepend-icon">
                  <input placeholder="www." type="text" name="domainName" id="domain-name" class="domain-name gui-input" value="">
                  <label for="domainName" class="field-icon">
                    <i class="fa fa-map-marker"></i>
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
      <button type="button" class="add-new-domain-confirm btn btn-primary btn-clipboard">Add Domain</button>
    </div>
  </div>
</div>
