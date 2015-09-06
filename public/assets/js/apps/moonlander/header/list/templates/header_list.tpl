<!-- Start: Header -->
<div class="navbar-branding">
  <a class="navbar-brand" href="/domains">
    <b>Absolute</b>Admin
  </a>
  <span id="toggle_sidemenu_l" class="ad ad-lines"></span>
</div>


<ul class="nav navbar-nav navbar-right">
	<li class="dropdown menu-merge">

    <a href="#" class="dropdown-toggle fw600" data-toggle="dropdown">
    	<i class="glyphicon glyphicon-user"></i>
      <span class="hidden-xs pl5"> <%= username %> </span>
      <span class="caret caret-tp hidden-xs"></span>
    </a>
    <ul class="dropdown-menu list-group dropdown-persist w250" role="menu">
      <li class="dropdown-header clearfix">
        <div class="pull-left ml10">
          <select id="user-status">
            <optgroup label="Current Status:">
              <option value="1-1">Away</option>
              <option value="1-2">Offline</option>
              <option value="1-3" selected="selected">Online</option>
            </optgroup>
          </select>
        </div>

        <div class="pull-right mr10">
          <select id="user-role">
            <optgroup label="Logged in As:">
              <option value="1-1">Client</option>
              <option value="1-2">Editor</option>
              <option value="1-3" selected="selected">Admin</option>
            </optgroup>
          </select>
        </div>
      </li>
      <li class="list-group-item">
        <a href="#" class="animated animated-short fadeInUp">
          <span class="fa fa-envelope"></span> Messages
          <span class="label label-warning">2</span>
        </a>
      </li>
      <li class="list-group-item">
        <a href="#" class="animated animated-short fadeInUp">
          <span class="fa fa-user"></span> Friends
          <span class="label label-warning">6</span>
        </a>
      </li>
      <li class="list-group-item">
        <a href="#" class="animated animated-short fadeInUp">
          <span class="fa fa-bell"></span> Notifications </a>
      </li>
      <li class="list-group-item">
        <a href="#" class="animated animated-short fadeInUp">
          <span class="fa fa-gear"></span> Settings </a>
      </li>
      <li class="dropdown-footer">
        <a href="#" class="">
        <span class="fa fa-power-off pr5"></span> Logout </a>
      </li>
    </ul>
  </li>
</ul>
<!-- End: Header -->