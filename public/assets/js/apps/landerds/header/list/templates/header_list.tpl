<!-- Start: Header -->
<div class="navbar-branding">
  <a class="navbar-brand" href="/">
          <img src="/assets/img/logos/LanderDSWhite3.png" title="LanderDS Logo" class="mt5 w200">
        </a>
  <!-- <span id="toggle_sidemenu_l" class="ad ad-lines"></span> -->
</div>
  <ul style="margin-left: 35px" class="landerds-nav nav navbar-nav navbar-left">
    <li class="landers">
      <a href="/landers" class="go-landers fw600">
        <span style="position: relative; top: 5px" class="fs20 icon-landers_icon"></span>
        <span class="ml5 sidebar-title">Landing Pages</span>
      </a>
    </li>
    <li class="groups">
      <a href="/groups" role="button" class="go-groups fw600">
        <span style="position: relative; top: 5px" class="fs20 icon-groups_icon"></span>
        <span  class="ml5 sidebar-title">Groups</span>
      </a>
    </li>
    <li class="domains">
      <a href="/domains" role="button" class="go-domains fw600">
        <span style="position: relative; top: 5px" class="fs20 icon-domains_icon"></span>
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
        <a style="color: #666 !important" href="/account" class="user-settings-account">
        <span class="fa fa-cog pr5"></span>Your Account &amp; Settings </a>
      </li>
      
      <li class="dropdown-footer">
        <a style="color: #666 !important" href="/logout" class="user-logout">
        <span class="fa fa-power-off pr5"></span> Logout </a>
      </li>
    </ul>
  </li>
</ul>
<!-- End: Header -->
