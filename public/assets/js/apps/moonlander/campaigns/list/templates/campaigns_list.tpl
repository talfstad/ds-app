    <!-- Start: Topbar -->
      <header id="first-topbar" class="alt">
        
      </header>
      <header id="topbar" class="ph10">
        
        <div class="dropdown pull-left">
          <button data-toggle="dropdown" role="button" aria-expanded="false" type="button" class="rows-per-page ml10 pl10 pt5 pb5 btn btn-default btn-gradient dark">
            <span class="fa fa-caret-down"></span>
            <span><span class="rows-per-page-number">10</span> Rows Per Page</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-left pt5" role="menu">
            <li>
              <a class="pl5 radio-custom radio-primary" href="#">
                <input checked data-sort-by="campaign-name" value="10" id="10-pages-radio" type="radio" name="pages-radio">
                <label class="ml5" for="10-pages-radio">10 Rows Per Page</label>
              </a>
            </li>
            <li>
              <a class="pl5 radio-custom radio-primary" href="#">
                <input value="20" data-sort-by="campaign-name" id="20-pages-radio" type="radio" name="pages-radio">
                <label class="ml5" for="20-pages-radio">20 Rows Per Page</label>
              </a>
            </li>
            <li>
              <a class="pl5 radio-custom radio-primary" href="#">
                <input value="50" data-sort-by="created-on" id="50-pages-radio" type="radio" name="pages-radio">
                <label class="ml5" for="50-pages-radio">50 Rows Per Page</label>
              </a>
            </li>
          </ul>
        </div>

        <div class="dropdown pull-left">
          <button data-toggle="dropdown" style="text-align: left" role="button" aria-expanded="false" type="button" class="ml10 w210 pl10 pt5 pb5 btn btn-default btn-gradient dark">
            <span class="fa fa-caret-down pr5"></span>
            Sort By: 
            <span class="sortbyname">Campaign Name</span> 
            <span class="sortbyorder">Asc</span>
          </button>
          <ul class="topbar dropdown-menu dropdown-menu-left pt5" role="menu">
            <li>
              <a class="pl5 radio-custom radio-primary" href="#">
                <input checked data-sortby-name="Domain Name" data-sort-by="campaign-name" type="radio" id="campaign-name" name="sort-radio">
                <label class="ml5" for="campaign-name">Campaign Name</label>
              </a>
            </li>
            <li>
              <a class="pl5 radio-custom radio-primary" href="#">
                <input data-sortby-name="Created On" data-sort-by="created-on" type="radio" id="created-on" name="sort-radio">
                <label class="ml5" for="created-on">Created On</label>
              </a>
            </li>
            <!-- <li>
              <a class="pl5 radio-custom radio-primary" href="#">
                <input data-sortby-name="Deployed" data-sort-by="deployed" type="radio" id="deployed" name="sort-radio">
                <label class="ml5" for="deployed">Deployed</label>
              </a>
            </li> -->
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
          <form class="navbar-form navbar-search pull-left mtn mbn" role="search">
            <div class=" mt10 form-group">
              <input type="text" class="lander-search w250 form-control" placeholder="Search Campaign Name..." value="">
            </div>
          </form>
        </ul>

        <div class="topbar-right hidden-xs hidden-sm">
           <div class="bs-component btn-group ml15">
            <button type="button" class="add-new-domain-button pl10 pt5 pb5 btn btn-default btn-gradient dark">
              <span class="fa fa-plus pr5"></span>Add New Campaign
            </button>
          </div>
        </div>
      </header>
      <!-- End: Topbar -->
      <!-- Begin: Content -->
      <section id="content" class="landers-list-content">
        <div style="position: absolute; width: 100%; font-size: 11px; font-weight: 600">
        
        <div style="float: left; margin-left: 15px; margin-bottom: 10px">Campaign Name</div>
        <div style="float: right; margin-right: 95px; margin-bottom: 10px">Deployed Landers</div>
        <div style="float: right; margin-right: 52px; margin-bottom: 10px">Deployed Domains</div>
        <div style="float: right; margin-right: 85px; margin-bottom: 10px">Created On</div>
        

        </div>
        <div id="campaigns-region" style="margin-top: 25px" class="ph10 landers-list-items">
          
        </div>
      </section>

      <section class="footer">
        <div id="footer-region" class="footer-container">
        </div>
      </section>

      <!-- End: Content -->
