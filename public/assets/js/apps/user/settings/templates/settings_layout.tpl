<div class="modal-dialog modal-lg">
  <div class=" modal-content">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">Your Account &amp; Settings</h4>
    </div>
    <header class="settings-topbar clearfix ph10">
      <div class="topbar-left">
        <ul class="nav nav-list nav-list-topbar mb0 pull-left">
          <li role="presentation" class="active">
            <a href="#aws" aria-controls="aws" role="tab" data-toggle="tab"><span class="fa fa-cog pr5"></span> AWS Settings</a>
          </li>
          <!-- <li role="presentation">
            <a href="#account" aria-controls="account" role="tab" data-toggle="tab"><span class="fa fa-user pr5"></span> Account</a>
          </li> -->
        </ul>
      </div>
    </header>
    <div class="group-list-region modal-body">
      <div class="tab-content">
        <div role="tabpanel" class="tab-pane active" id="aws">
          <div class="alert-loading spinner-full-container">
            <div class="modal-loading-container">
              <span class="spinner-large glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
              <h4 class="loading-text">Updating AWS keys &amp; migrating you to your new account. Please be patient.</h4>
            </div>
          </div>
          <div class="alert alert-micro alert-border-left alert-default aws-default-alert">
            <i class="fa fa-info pr10"></i> We use your AWS settings to manage and organize your landers. <a href="#" class="alert-link">Where do I find my keys?</a>
          </div>
          <div style="display:none;" class="alert has-error alert-micro alert-border-left alert-danger aws-error-alert"></div>
          <div style="display:none;" class="alert alert-micro alert-border-left alert-info aws-info-alert"></div>
          <div style="display:none;" class="alert alert-micro alert-border-left alert-success aws-success-alert"></div>
          
          <div class="panel panel-primary top mb35">
            <div class="panel-heading">
              <span class="panel-title">AWS Access Settings</span>
            </div>
            <div class="aws-settings-region panel-body bg-light dark">
            </div>
            <div class="panel-footer">
              <button type="button" class="update-aws-access-keys btn btn-primary btn-clipboard">Update Access Keys</button>
            </div>
          </div>
        </div>
        <!-- <div role="tabpanel" class="tab-pane" id="account">ACCOUNT</div> -->
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" data-dismiss="modal" class="btn btn-default btn-clipboard">Close</button>
    </div>
  </div>
</div>
