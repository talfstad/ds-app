<!-- Start: Header -->
<div class="navbar-branding">
  <a class="navbar-brand" href="dashboard.html">
          <img src="/assets/img/logos/landerds_logo_white1.png" title="LanderDS Logo" class="mt5 w170">
        </a>
  <!-- <span id="toggle_sidemenu_l" class="ad ad-lines"></span> -->
</div>
  <ul style="margin-left: 35px" class="landerds-nav nav navbar-nav navbar-left">
    <li class="landers">
      <a href="/landers" class="go-landers fw600">
        <img style="width: 20px" src="/assets/img/logos/landers_icon_e9e9e9.png"/>
        <span class="ml5 sidebar-title">Landing Pages</span>
      </a>
    </li>
    <li class="campaigns">
      <a href="/campaigns" role="button" class="go-campaigns fw600">
        <img style="width: 20px" src="/assets/img/logos/campaigns_icon_e9e9e9.png"/>
        <span  class="ml5 sidebar-title">Campaigns</span>
      </a>
    </li>
    <li class="domains">
      <a href="/domains" role="button" class="go-domains fw600">
        <img style="width: 20px" src="/assets/img/logos/domains_icon_e9e9e9.png"/>
        <span class="ml5 sidebar-title">Domains</span>
      </a>
    </li>
  </ul>

<ul class="nav navbar-nav navbar-right">
	<li class="dropdown menu-merge">

    <a href="#" class="dropdown-toggle fw600" data-toggle="dropdown">
    	<i class="glyphicon glyphicon-user"></i>
      <span class="hidden-xs pl5"> <%= username %> </span>
      <span class="caret hidden-xs"></span>
    </a>
    <ul class="dropdown-menu list-group dropdown-persist w250" role="menu">
      <li class="dropdown-footer">
        <a style="color: #666 !important" href="/account">
        <span class="fa fa-cog pr5"></span>Your Account &amp; Settings </a>
      </li>
      
      <li class="dropdown-footer">
        <a style="color: #666 !important" href="#" class="user-logout">
        <span class="fa fa-power-off pr5"></span> Logout </a>
      </li>
    </ul>
  </li>
</ul>
<!-- End: Header -->
