
  <!-- Start: Main -->
  <div id="main" class="animated fadeIn">

    <!-- Start: Content-Wrapper -->
    <section>

      <!-- begin canvas animation bg -->
      <div id="canvas-wrapper">
        <canvas id="demo-canvas"></canvas>
      </div>

      <!-- Begin: Content -->
      <section id="content">

        <div class="admin-form theme-info" id="login1">

          <div class="row mb15 table-layout">

            <div class="col-xs-6 va-m pln">
              <a href="dashboard.html" title="Return to Dashboard">
                <img src="assets/img/logos/moonlanderlogo.png" title="AdminDesigns Logo" class="img-responsive w250">
              </a>
            </div>

            <div class="col-xs-6 text-right va-b pr5">
              <div class="login-links">
                <a href="#" class="notification active" title="Sign In">Sign In</a>
                <span class="text-white"> | </span>
                <a href="pages_register.html" class="" title="Register">Register</a>
                <span class="text-white"> | </span>
                <a href="pages_register.html" class="" title="Recover Password">Forgot Password</a>
              </div>

            </div>

          </div>

          <div class="panel panel-info mt10 br-n">
            <div class="panel-heading heading-border"></div>

            <!-- end .form-header section -->
            <form id="login-form">
              <div class="panel-body bg-light p30">
                <div class="row">
                  <div class="col-sm-7 pr30">

                    <div class="section form-group">
                      <label for="username" class="field-label text-muted fs18 mb10">Username <span class="help-block"></span></label>
                      <label for="username" class="field prepend-icon">
                        <input type="text" name="username" id="username" class="gui-input" placeholder="Enter username">
                        <label for="username" class="field-icon">
                          <i class="fa fa-user"></i>
                        </label>
                      </label>
                    </div>
                    <!-- end section -->

                    <div class="section form-group">
                      <label for="password" class="field-label text-muted fs18 mb10">Password <span class="help-block"></span></label>
                      <label for="password" class="field prepend-icon">
                        <input type="password" name="password" id="password" class="gui-input" placeholder="Enter password">
                        <label for="password" class="field-icon">
                          <i class="fa fa-lock"></i>
                        </label>
                      </label>
                    </div>
                    <!-- end section -->

                  </div>
                  <div class="col-sm-5 br-l br-grey pl30">
                    <h3 class="mb25"> You'll Have Access To:</h3>
                    <p class="mb15">
                      <span class="fa fa-check text-success pr5"></span> No Configuration Deployment</p>
                    <p class="mb15">
                      <span class="fa fa-check text-success pr5"></span> Live Editing your Landers</p>
                    <p class="mb15">
                      <span class="fa fa-check text-success pr5"></span> 1 Click Lander Optimization</p>
                    <p class="mb15">
                      <span class="fa fa-check text-success pr5"></span> 1 Click Rip and Deploy</p>
                  </div>
                </div>
              </div>
              <!-- end .form-body section -->
              <div class="panel-footer clearfix p10 ph15">
                <button id="sign-in-button" type="submit" class="button btn-primary mr10 pull-right">Sign In</button>
                <label class="switch ib switch-primary pull-left input-align mt10">
                  <input type="checkbox" name="remember" id="remember" checked>
                  <label for="remember" data-on="YES" data-off="NO"></label>
                  <span>Remember me</span>
                </label>
              </div>
              <!-- end .form-footer section -->
            </form>
          </div>
        </div>

      </section>
      <!-- End: Content -->

    </section>
    <!-- End: Content-Wrapper -->

  </div>