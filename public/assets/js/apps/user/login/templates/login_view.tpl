<div class="row mb15 table-layout">
  <div class="col-xs-6 va-m pln">
    <a href="#" title="Return to Dashboard">
      <img src="/assets/img/logos/LanderDSWhite3.png" title="Lander DS Logo" class="img-responsive w200">
    </a>
  </div>
  <div class="col-xs-6 text-right va-b pr5">
    <div class="login-links">
      <a href="#" class="notification active" title="Sign In">Sign In</a>
      <span class="text-white"> | </span>
      <a class="forgot-password" href="#" title="Forgot Password">Forgot Password</a>
    </div>
  </div>
</div>
<div class="panel panel-info mt10 br-n">
  <div class="alert-loading spinner-full-container">
    <div class="modal-loading-container">
      <span class="spinner-large glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
      <h4 class="loading-text">Logging <span data-handle="user">you</span> in.</h4>
    </div>
  </div>
  <div class="panel-heading heading-border no-border"></div>
  <!-- end .form-header section -->
  <form id="login-form">
    <div class="panel-body bg-light p30">
      <div class="row">
        <div class="col-sm-7 pr30">
          <div class="section form-group">
            <label for="username" class="field-label text-muted fs18 mb10">Username</label>
            <label for="username" class="field prepend-icon">
              <input type="text" name="username" id="username" class="gui-input" placeholder="Enter username">
              <label for="username" class="field-icon">
                <i class="fa fa-user"></i>
              </label>
            </label>
          </div>
          <!-- end section -->
          <div class="section form-group">
            <label for="password" class="field-label text-muted fs18 mb10">Password</span>
            </label>
            <label for="password" class="field prepend-icon">
              <input type="password" name="password" id="password" class="gui-input" placeholder="Enter password">
              <label for="password" class="field-icon">
                <i class="fa fa-lock"></i>
              </label>
            </label>
          </div>
          <!-- end section -->
        </div>
        <div class="col-sm-5 br-l br-grey pl20">
          <img style="width: 295px; margin: 25px 0 10px" src="assets/img/logos/logintaglinecheck.png" />
        </div>
      </div>
    </div>
    <!-- end .form-body section -->
    <div class="panel-footer clearfix p10 ph15">
      <button id="sign-in-button" type="submit" class="button btn-primary mr10 pull-right">Sign In</button>
    </div>
    <!-- end .form-footer section -->
  </form>
</div>
