<div class="modal-dialog modal-lg">
  <div class=" modal-content">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">Rip a New Lander</h4>
    </div>
    <div class="campaigns-list-region modal-body">
      <div class="alert-loading spinner-full-container">
        <div class="modal-loading-container">
          <span class="spinner-large glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
          <h4 class="loading-text">Ripping New Lander From URL</span></h4>
        </div>
      </div>
      <div class="alert alert-micro alert-border-left alert-default new-lander-info-alert">
        <i class="fa fa-info pr10"></i> To rip a new lander enter it's URL and give it a name. Have questions? <a href="#" class="alert-link">Check out this step by step guide.</a>
      </div>
      <div class="panel panel-primary top mb35">
        <div class="panel-heading">
          <span class="panel-title">Rip New Lander Information</span>
        </div>
        <div class="panel-body bg-light dark">
          <div class="admin-form">
            <div class="section row mb10">
              <label for="landerName" class="text-align-right field-label col-md-3 text-center">New Lander Name:</label>
              <div class="col-md-9">
                <label for="landerName" class="field prepend-icon">
                  <input type="text" name="landerName" id="lander-name" class="lander-name gui-input" value="">
                  <label for="landerName" class="field-icon">
                    <i class="fa fa-file"></i>
                  </label>
                </label>
              </div>
            </div>
            <div class="section row mb10">
              <label for="landerUrl" class="text-align-right field-label col-md-3 text-center">Lander URL:</label>
              <div class="col-md-9">
                <label for="landerUrl" class="field prepend-icon">
                  <input placeholder="http://" type="text" name="landerUrl" id="lander-url" class="lander-url gui-input" value="">
                  <label for="landerUrl" class="field-icon">
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
      <button type="button" data-dismiss="modal" class="btn btn-default btn-clipboard">Cancel</button>
      <button type="submit" class="rip-new-lander-confirm btn btn-primary btn-clipboard">Rip New Lander</button>
    </div>
  </div>
</div>
