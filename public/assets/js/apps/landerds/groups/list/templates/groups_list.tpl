    <!-- Start: Topbar -->
      <header id="first-topbar" class="alt">
        
      </header>
      <header id="topbar" class="ph10">
        
        <div class="admin-form dropdown pull-left">
          <button data-toggle="dropdown" role="button" aria-expanded="false" type="button" class="rows-per-page ml10 pl10 pt5 pb5 btn btn-default btn-gradient dark">
            <span class="fa fa-caret-down"></span>
            <span><span class="rows-per-page-number">10</span> Rows Per Page</span>
          </button>
          <ul class="page-size-dropdown dropdown-menu dropdown-menu-left pt5" role="menu">
            <li>
              <label for="10-pages-radio" class="block option option-primary" style="line-height: 40px; margin-right: 0">
                <input value="10" id="10-pages-radio" type="radio" name="pages-radio">
                <span class="mb10 mt10 ml10 radio"></span>
                <span class="fs13 fw600">10 Rows Per Page</span>
              </label>
            </li>
            <li>
              <label for="20-pages-radio" class="block option option-primary" style="line-height: 40px; margin-right: 0">
                <input value="20" id="20-pages-radio" type="radio" name="pages-radio">
                <span class="mb10 mt10 ml10 radio"></span>
                <span class="fs13 fw600">20 Rows Per Page</span>
              </label>
            </li>
            <li>
              <label for="50-pages-radio" class="block option option-primary" style="line-height: 40px; margin-right: 0">
                <input value="50" id="50-pages-radio" type="radio" name="pages-radio">
                <span class="mb10 mt10 ml10 radio"></span>
                <span class="fs13 fw600">50 Rows Per Page</span>
              </label>
            </li>
          </ul>
        </div>

        <div class="admin-form dropdown pull-left">
          <button data-toggle="dropdown" style="text-align: left" role="button" aria-expanded="false" type="button" class="ml10 w210 pl10 pt5 pb5 btn btn-default btn-gradient dark">
            <span class="fa fa-caret-down pr5"></span>
            Sort By: 
            <span class="sortbyname">Group Name</span> 
            <span class="sortbyorder">Asc</span>
          </button>

          <ul class="topbar dropdown-menu dropdown-menu-left pt5" role="menu">
            <li>
              <label for="group-name" class="block option option-primary" style="line-height: 40px; margin-right: 0">
                <input data-sortby-name="Group Name" data-sort-by="group-name" type="radio" name="sort-radio" id="group-name">
                <span class="mb10 mt10 ml10 radio"></span>
                <span class="ml5 fs13 fw600">Group Name</span>
              </label>
            </li>
            <li>
              <label for="created-on" class="block option option-primary" style="line-height: 40px; margin-right: 0">
                  <input data-sortby-name="Created On" data-sort-by="created-on" type="radio" name="sort-radio" id="created-on">
                  <span class="mb10 mt10 ml10 radio"></span>
                  <span class="ml5 fs13 fw600">Created On</span>
              </label>
            </li>
           
            <li class="divider">
            </li>
            <div class="ptn pb5 p10">
              <div class="sort-order-button-group btn-group btn-group-justified btn-group-nav" role="tablist">
                <a data-toggle="tab" data-sortby-order="Asc" data-sort-order="asc" class="btn btn-default btn-sm active">Asc</a>
                <a data-toggle="tab" data-sortby-order="Desc" data-sort-order="desc" class="btn btn-default btn-sm">Desc</a>
              </div>
            </div>
          </ul>
        </div>

        <ul class="nav nav-list nav-list-topbar pull-left">
          <form class="admin-form navbar-form navbar-search pull-left mtn mbn" role="search">
            <div class="search-dropdown dropdown pull-left mt10 form-group">
              <input data-toggle="dropdown" aria-expanded="false" type="text" class="list-search w250 form-control" placeholder="Search Groups..." value="">
              <ul class="search-dropdown-menu dropdown-menu dropdown-menu-left pt5" role="menu">
                <li style="width: 100%;">
                  <label for="search-name" class="block option option-primary" style="line-height: 40px; margin-right: 0">
                    <input checked type="checkbox" class="search-filter-option" name="searchName" id="search-name">
                    <span class="mb10 mt10 ml10 checkbox"></span>
                    <span class="ml5 fs13 fw600">Search Name</span>
                  </label>
                </li>
                <li class="mb10" style="width: 100%;">
                  <label for="search-notes" class="block option option-primary" style="line-height: 40px; margin-right: 0">
                      <input type="checkbox" class="search-filter-option" name="searchNotes" id="search-notes">
                      <span class="mb10 mt10 ml10 checkbox"></span>
                      <span class="ml5 fs13 fw600">Search Notes</span>
                  </label>
                </li>
              </ul>
            </div>
          </form>
        </ul>

        <div class="topbar-right hidden-xs hidden-sm">
          <button type="button" class="toggle-help-info btn btn-default btn-gradient dark pl10 pt5 pb5">
            <i class="fa fa-info-circle"></i>
          </button>
           <div class="bs-component btn-group ml5">
            <button type="button" class="add-new-group-button pl10 pt5 pb5 btn btn-default btn-gradient dark">
              <span class="fa fa-plus pr5"></span>New Group
            </button>
          </div>
        </div>
      </header>
      <!-- End: Topbar -->
      <!-- Begin: Content -->
      <section id="content" class="landers-list-content">
        <div style="position: absolute; width: 100%; font-size: 11px; font-weight: 600">
        
        <div style="float: left; margin-left: 15px; margin-bottom: 10px">Group Name</div>
        <div style="float: right; margin-right: 150px; margin-bottom: 10px">Landers</div>
        <div style="float: right; margin-right: 99px; margin-bottom: 10px">Domains</div>
        <div style="float: right; margin-right: 83px; margin-bottom: 10px">Created On</div>
        

        </div>
        <div id="groups-region" style="margin-top: 25px" class="ph10 landers-list-items">
          
        </div>
      </section>

      <section class="footer">
        <div id="footer-region" class="footer-container">
        </div>
      </section>

      <!-- End: Content -->
