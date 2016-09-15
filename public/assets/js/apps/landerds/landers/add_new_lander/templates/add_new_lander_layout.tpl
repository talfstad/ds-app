<div class="modal-dialog modal-lg">
    <div class=" modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">Add a New Lander</h4>
        </div>

        <div class="groups-list-region modal-body">
          <div class="alert-loading spinner-full-container">
            <div class="modal-loading-container" style="margin-top: 200px">
              <span class="spinner-large glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
              <h4 class="loading-text">Adding New Lander</span></h4>
            </div>
          </div>

          <div class="alert alert-micro alert-border-left alert-default new-lander-info-alert">
            <i class="fa fa-info pr10"></i>
            To add a new lander select a new lander name and upload your lander. <a href="#" class="alert-link">How should I format my zip file for upload?</a>
          </div>

          <div class="panel panel-primary top mb5">
            <div class="panel-heading">
              <span class="panel-title">New Lander Information</span>
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
                  <label for="landerFile" class="text-align-right field-label col-md-3 text-center">Select Lander:</label>
                  <div class="col-md-9">
                      <input type="file" name="landerFile" id="new-lander-file" class="file-loading" value="">
                  </div>
                </div>
              </div>
              </div>
          </div>
        </div>

        <div class="modal-footer">
            <button type="button" data-dismiss="modal" class="btn btn-default btn-clipboard">Cancel</button>
            <button type="submit" class="add-new-lander-confirm btn btn-primary btn-clipboard">Add New Lander</button>
        </div> 
    </div>
</div>