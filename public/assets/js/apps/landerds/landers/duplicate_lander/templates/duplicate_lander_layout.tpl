<div class="modal-dialog modal-lg">
    <div class=" modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">Create a Copy of <%= fromName %></h4>
        </div>

        <div class="group-list-region modal-body">
          <div class="alert-loading spinner-full-container">
            <div class="modal-loading-container">
              <span class="spinner-large glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
              <h4 class="loading-text">Making Copy From Lander</span></h4>
            </div>
          </div>
                     
          <div class="alert alert-micro alert-border-left alert-default new-lander-info-alert">
            <i class="fa fa-info pr10"></i>
            Making a copy helps you quickly make several versions of a lander to split test.
          </div>

          <div class="panel panel-primary top mb35">
            <div class="panel-heading">
              <span class="panel-title">Create Lander Copy Information</span>
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
              </div>
              </div>
          </div>              
        </div>


        <div class="modal-footer">
            <button type="button" data-dismiss="modal" class="btn btn-default btn-clipboard">Close</button>
            <button type="submit" class="duplicate-lander-confirm btn btn-primary btn-clipboard">Create Copy</button>
        </div> 
    </div>
</div>