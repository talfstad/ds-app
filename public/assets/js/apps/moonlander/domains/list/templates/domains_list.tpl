<!-- Start: Content-Wrapper -->
  
      <!-- Start: Topbar -->
      <header id="first-topbar" class="alt">
        <div class="topbar-left">
          <ol class="breadcrumb">
            <li class="crumb-active">
              <a href="dashboard.html">Domains</a>
            </li>
            <li class="crumb-trail">Manage your domains, campaigns, and landers</li>
          </ol>
        </div>
      </header>

      <header id="topbar" class="ph10" data-spy="affix" data-offset-top="60">
        <div class="dropdown pull-left">
          <a href="#" data-toggle="dropdown" role="button" aria-expanded="false" class="dropdown-toggle btn btn-default btn-sm light fw600 ml10">
            <span class="fa fa-caret-down pr5"></span> Sort By 
          </a>

          <ul class="topbar dropdown-menu dropdown-menu-left animated animated-short flipInX pt5" role="menu">
            

            <li>
              <a class="pl5 radio-custom radio-primary" href="#">
                <input type="radio" id="domain" name="radioExample">
                <label class="ml5" for="domain">Domain</label>
              </a>
            </li>
            <li>
              <a class="pl5 radio-custom radio-primary" href="#">
                <input type="radio" id="date-added" name="radioExample">
                <label class="ml5" for="date-added">Last Deployed</label>
              </a>
            </li>
            <li>
              <a class="pl5 radio-custom radio-primary" href="#">
                <input type="radio" id="domain-status" name="radioExample">
                <label class="ml5" for="domain-status">Domain Status</label>
              </a>
            </li>
            <li class="divider">
            </li>
            <div class="ptn pb5 p10">
              <div class="btn-group btn-group-justified btn-group-nav" role="tablist">
                <a href="#nav-tab1" data-toggle="tab" class="btn btn-default btn-sm active">Asc</a>
                <a href="#nav-tab3" data-toggle="tab" class="btn btn-default btn-sm">Desc</a>
              </div>
            </div>
          </ul>
        </div>
        <ul class="nav nav-list nav-list-topbar pull-left">
          
         
          <form class="navbar-form navbar-search pull-left mtn mbn" role="search">
            <div class=" mt10 form-group">
              <input type="text" class="form-control" placeholder="Search..." value="">
            </div>
          </form>


        </ul>
       


        <div class="topbar-right hidden-xs hidden-sm">
          <div class="btn-group" data-toggle="buttons">
            <label data-action="collapse-all" class="btn btn-default btn-sm light fw600 active">
              <input type="radio" name="options" id="collapse-all" autocomplete="off">Collapse All
            </label>
            <label data-action="expand-all" class="btn btn-default btn-sm light fw600">
              <input type="radio" name="options" id="expand-all" autocomplete="off">Expand All
            </label>
          </div>

          <a href="#" class="toggle_sidemenu_r btn btn-default btn-sm light fw600 ml10">
            <span class="fa fa-plus pr5"></span> Add Domain 
          </a>
        </div>
      </header>
      <!-- End: Topbar -->



      <!-- Begin: Content -->
      <section id="content">
        <!-- Demo Content: Center Column Text -->
        <div class="ph10">
            <ol class="domain-list">
              <li class="domain-item">
                <a data-toggle="collapse" href="#domainsList" aria-expanded="false" aria-controls="domainsList">
                  <div class="domain-title open_sidemenu_r">
                      <span class="collapse-icon fa fa-plus"></span>
                     extremefitness.org
                    <span class="domain-controls">
                      <span class="domain-notification-label fs11 fw600 pull-right label label-xs label-success ml5">Deployed</span>
                    </span>
                    <small class="pull-right fs10 mr15">Last Deployed 8/26/15 at 2:34pm</small>
                  </div>
                </a>

                <div id="domainsList" class="collapse">
                  <ol class="campaign-list pb15">
                    <li class="campaign-item">
                      <a data-toggle="collapse" href="#campaignsList" aria-expanded="false" aria-controls="campaignsList">
                        <div class="campaign-title open_sidemenu_r">
                          <span class="collapse-icon fa fa-plus"></span>
                          Campaign 1
                          <span class="campaign-controls">
                            <span class="domain-notification-label fs11 fw600 pull-right label label-xs label-success ml5">
                                <span title="Currently being deployed" class="fa fa-check"></span>
                              </span>
                          </span>
                        </div>
                      </a>
                      <div id="campaignsList" class="collapse">
                        <ol class="lander-list pb15">
                          <li class="lander-item">
                              <div class="lander-title">Lander 1</div>
                            <div class="lander-content">
                            </div>
                          </li>
                        </ol>
                      </div>
                    </li>
                  </ol>
                </div>
              </li>
              <li class="domain-item">
                  <a data-toggle="collapse" href="#domainsList1" aria-expanded="false" aria-controls="domainsList1">
                    <div class="domain-title open_sidemenu_r">
                      <span class="collapse-icon fa fa-plus"></span>
                      hardbodiesandboners.com

                      <span class="domain-controls">
                        <span class="domain-notification-label fs11 fw600 pull-right label label-xs label-warning ml5">
                          <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
                        Deploying...</span>
                      </span>
                      <small class="pull-right fs10 mr15">Last Deployed 8/26/15 at 2:34pm</small>
                    </div>
                  </a>
                <div id="domainsList1" class="collapse">
                  <ol class="campaign-list pb15">
                    <li class="campaign-item">
                      <a data-toggle="collapse" href="#campaignsList2" aria-expanded="false" aria-controls="campaignsList2">

                        <div class="campaign-title open_sidemenu_r">
                          <span class="collapse-icon fa fa-plus"></span>
                          Adult2 US camp
                          <span class="campaign-controls">
                            <span class="domain-notification-label fs11 fw600 pull-right label label-xs label-success ml5">
                                <span title="Currently being deployed" class="fa fa-check"></span>
                              </span>
                          </span>
                        </div>
                        </a>
                      <div id="campaignsList2" class="collapse">
                        <ol class="lander-list pb15">
                          <li class="lander-item">
                              <div class="lander-title">Lander 1</div>
                            <div class="lander-content">
                            </div>
                          </li>
                        </ol>
                      </div>
                    </li>
                    <li class="campaign-item">
                        <a data-toggle="collapse" href="#campaignsList1" aria-expanded="false" aria-controls="campaignsList1">
                          <div class="campaign-title open_sidemenu_r">
                            <span class="collapse-icon fa fa-plus"></span>
                            Bone Dawg Camp3
                            <span class="campaign-controls">
                              <span class="domain-notification-label fs11 fw600 pull-right label label-xs label-warning ml5">
                                <span title="Currently being deployed" class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
                              </span>
                            </span>
                          </div>
                        </a>
                      <div id="campaignsList1" class="collapse">
                        <ol class="lander-list pb15">
                          <li class="lander-item">
                              <div class="lander-title">Lander 1</div>
                            <div class="lander-content">
                            </div>
                          </li>
                          <li class="lander-item">
                              <div class="lander-title">Lander 1</div>
                            <div class="lander-content">
                            </div>
                          </li>
                          <li class="lander-item">
                              <div class="lander-title">Lander 1</div>
                            <div class="lander-content">
                            </div>
                          </li>
                          <li class="lander-item">
                              <div class="lander-title">Lander 1</div>
                            <div class="lander-content">
                            </div>
                          </li>
                          <li class="lander-item">
                              <div class="lander-title">Lander 1</div>
                            <div class="lander-content">
                            </div>
                          </li>
                        </ol>
                      </div>
                    </li>
                  </ol>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <!-- End: Content -->