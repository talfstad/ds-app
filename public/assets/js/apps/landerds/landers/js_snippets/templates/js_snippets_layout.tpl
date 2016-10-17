<div class="modal-dialog snippets-modal modal-lg">
  <div class=" modal-content">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      <div>
        <span class="measure-width" style="display:none; font-weight: 600; font-size: 15px"><%= name %></span>
        <input class='editable-lander-name' type='text' value='<%= name %>'/>
      </div>
    </div>
    <header class="settings-topbar clearfix ph10">
      <div class="topbar-left">
        <ul class="nav nav-list nav-list-topbar mb0 pull-left">
          <li role="presentation" class="active">
            <a href="#aws" aria-controls="aws" role="tab" data-toggle="tab"><span class="fa fa-file-code-o pr5"></span> JS Snippets</a>
          </li>
        </ul>
      </div>
    </header>
    <div class="tab-content">
      <div role="tabpanel" class="tab-pane active" id="aws">
        <section class="snippets-list clearfix">
          <aside id="snippets-sidebar-left" class="clearfix">
            <!-- Start: Sidebar Left Content -->
            <div class="sidebar-left-content nano-content">
              <!-- Start: Sidebar Header -->
              <header class="sidebar-header">
                <!-- Sidebar Widget - Search (hidden) -->
                <div class="sidebar-widget search-widget">
                  <div class="input-group">
                    <span class="input-group-addon">
                <i class="fa fa-search"></i>
              </span>
                    <input type="text" id="js-snippet-sidebar-search" class="form-control" placeholder="Search...">
                  </div>
                </div>
              </header>
              <!-- End: Sidebar Header -->
              <!-- Start: Sidebar Menu -->
              <div class="snippet-totals-region"></div>
              <div class="snippets-list-region sidebar-menu-container">
              </div>
              <div class="create-snippet-container">
                <button type="button" class="create-snippet-button mt5 mb10 pl10 pt5 pb5 btn btn-default btn-gradient dark">
                  <span class="fa fa-plus pr5"></span>Create New Snippet
                </button>
              </div>
              <!-- End: Sidebar Menu -->
            </div>
            <!-- End: Sidebar Left Content -->
          </aside>
          <aside style="float: left" class="clearfix snippet-detail-region">
          </aside>
        </section>
      </div>
      <div role="tabpanel" class="tab-pane" id="account">
        <div class="modal-body">
          Snippet Resources
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" data-dismiss="modal" class="btn btn-default btn-clipboard">Close</button>
    </div>
  </div>
</div>
