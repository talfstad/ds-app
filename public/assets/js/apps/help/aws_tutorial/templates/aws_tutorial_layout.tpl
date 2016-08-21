<div class="modal-dialog modal-lg">
  <div class=" modal-content">
    <div class="modal-header">
      <h4 class="modal-title">Welcome to Lander DS!</h4>
    </div>
    <div class="campaigns-list-region modal-body">
      <div class="row">
        <div class="col-md-12">
          <div class="alert alert-micro alert-border-left alert-alert">
            <i class="fa fa-info pr10"></i> For support, and other communication during beta, click on the blue question mark on the lower right side of the window.
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <h4>Please connect your AWS account before continuing.</h4>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 mt20">
          <h5>1. Sign in to the AWS Management Console: <a target="_blank" href="https://aws.amazon.com">https://aws.amazon.com</a></h5>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <h5>2. Click on "Identity &amp; Access Management"</h5>
        </div>
        <div class="col-md-8">
          <img style="width: 271px" src="/assets/img/tutorials/identityaccessmanagement.png" alt="Identity And Access Management thumbnail" />
        </div>
      </div>
      <div class="row mt20">
        <div class="col-md-4">
          <h5>3. Click on "Users" under IAM Resources</h5>
        </div>
        <div class="col-md-8">
          <img style="width: 400px" src="/assets/img/tutorials/usersiamresources.png" alt="users link thumbnail" />
        </div>
      </div>
      <div class="row mt20">
        <div class="col-md-4">
          <h5>4. Create a new user for Lander DS and make sure "Generate an access key for each user" is checked</h5>
        </div>
        <div class="col-md-8">
          <img style="width: 530px" src="/assets/img/tutorials/createnewuseraws.png" alt="users link thumbnail" />
        </div>
      </div>
      <div class="row mt20">
        <div class="col-md-4">
          <h5>5. Download/Save your user credentials. These are what Lander DS uses to connect to your account.</h5>
        </div>
        <div class="col-md-8">
          <img style="width: 428px" src="/assets/img/tutorials/usercredentials.png" alt="users link thumbnail" />
        </div>
      </div>
      <div class="row mt20">
        <div class="col-md-4">
          <h5>5. Back under "Users", click on the row of the user you just created (not the check box) to take you to user settings. Click on the "Permissions" tab and Click "Attach Policy". </h5>
        </div>
        <div class="col-md-8">
          <img style="width: 410px" src="/assets/img/tutorials/usersettings.png" alt="users link thumbnail" />
        </div>
      </div>
      <div class="row mt20">
        <div class="col-md-4">
          <h5>6. Selet the checkbox for the "AdministratorAccess" policy name and click "Attach Policy". </h5>
        </div>
        <div class="col-md-8">
          <img style="width: 510px" src="/assets/img/tutorials/selectpolicy.png" alt="users link thumbnail" />
        </div>
      </div>
      <div class="row mt20 mb20">
        <div class="col-md-12">
          <h5>7. Type your Access Key ID and Secret Access Key into the form below and click "Update Access Keys". Please be patient, it may take a few minutes for AWS to update once you've added a user.</h5>
        </div>
      </div>


      <div class="alert-loading spinner-full-container">
        <div class="modal-loading-container" style="position:absolute; left: 180px; bottom: 100px">
          <span class="spinner-large glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
          <h4 class="loading-text">Updating AWS keys &amp; migrating you to your new account. Please be patient.</h4>
        </div>
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
      <!-- <div role="tabpanel" class="tab-pane" id="account">ACCOUNT</div> -->
    </div>
    <!-- <div class="modal-footer">
    </div> -->
  </div>
</div>
