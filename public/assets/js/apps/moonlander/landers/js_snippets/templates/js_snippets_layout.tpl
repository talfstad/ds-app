<div class="modal-dialog modal-lg">
  <div class=" modal-content">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      <h4 class="modal-title"><%= name %></h4>
    </div>
    <header class="settings-topbar clearfix ph10">
      <div class="topbar-left">
        <ul class="nav nav-list nav-list-topbar mb0 pull-left">
          <li role="presentation" class="active">
            <a href="#aws" aria-controls="aws" role="tab" data-toggle="tab"><span class="fa fa-file-code-o pr5"></span> JS Snippets</a>
          </li>
          <li role="presentation">
            <a href="#account" aria-controls="account" role="tab" data-toggle="tab"><span class="fa fa-folder-open pr5"></span> Snippet Resources</a>
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
                    <input type="text" id="sidebar-search" class="form-control" placeholder="Search...">
                  </div>
                </div>
              </header>
              <!-- End: Sidebar Header -->
              <!-- Start: Sidebar Menu -->
              <div class="snippet-list-title">List of all JS Snippets</div>
              <div class="snippets-list-region sidebar-menu-container">
                
              </div>
              <!-- End: Sidebar Menu -->
            </div>
            <!-- End: Sidebar Left Content -->
          </aside>
          <aside style="float: left" class="clearfix">
            <header class="snippets-header">
              <div class="snippet-name-container">
                <div class="snippet-name">
                  <h4>Snippet Name</h4>
                </div>
                <div style="float: left; margin-top: 11px; font-size: 12px">
                  <a href="">
                See Description
                </a>
                </div>
              </div>
              <div class="control-buttons-container">
                <div class="btn-group">
                  <div class="add-snippet-to-page-container">
                    <select class="select2-single form-control">
                      <option value="CA">index.html</option>
                      <option value="AL">index2.html</option>
                      <option value="WY">jose2.html</option>
                    </select>
                    <button type="button" style="border-left:none" class="mr10 pl10 pt5 pb5 btn btn-default btn-gradient dark">
                      <span class="fa fa-plus pr5"></span>Add to Page
                    </button>
                  </div>
                  <button type="button" class="disabled pl10 pt5 mr10 pb5 btn btn-default btn-gradient dark">
                    <span class="fa fa-save pr5"></span>Save Changes
                  </button>
                  
                </div>
              </div>
            </header>
            <div class="code-pane resize-edit clearfix">
            <div class="js-snippet-alert">
            asdf
            </div>
              <div class="js-snippet-description">
                <div style="float: left; margin-left: 45px; margin-top: 45px;">
                  <div style="float: left; width: 100%">
                    <h3>Description:</h3>
                    <div>
                      <div style="float: left; width: 50%">
                        <p>
                          Lorem ipsum dolor sit amet, vitae dui, ac orci malesuada leo viverra elit, felis adipiscing quos lorem aliquam a amet, wisi libero urna venenatis suspendisse. Class nec nulla pede rutrum adipiscing
                        </p>
                      </div>
                      <div style="float: left; width: 50%;">
                        <div class="btn-group" style="float: right; margin-right: 30px;">
                          
                          <button type="button" style="width: 138px" class="delete-lander-button btn btn-default btn-gradient dark"><span class="fa fa-file-code-o pr5"></span>Edit Snippet</button>
                          <button type="button" style="width: 138px" class="delete-lander-button btn btn-danger btn-gradient dark"><span class="fa fa-trash-o pr5"></span>Delete Snippet</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <form>
                <textarea style="display: none" class="code-area"></textarea>
              </form>
            </div>
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
