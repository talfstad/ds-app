<!-- Start: Sidebar Right Content -->
<div class="sidebar-right-content nano-content p10">
  <div class="panel">
    <div class="panel-heading">
      <span class="panel-title">Preview, Edit &amp; Optimize</span>
      <span class="close-right-sidebar panel-controls"><a href="#" class="panel-control-loader"></a><a href="#" class="panel-control-remove"></a></span>
    </div>
    <div class="panel-menu">
      <div class="btn-group">
        <button type="button" style="width: 97px" class="duplicate-lander-button btn btn-default btn-gradient dark"><span class="fa fa-copy pr5"></span>Duplicate</button>
        <button type="button" style="width: 70px" class="lander-edit btn btn-default btn-gradient dark"><span class="fa fa-edit pr5"></span>Edit</button>
        <button type="button" style="width: 88px" class="save disabled btn btn-default btn-gradient dark"><span class="fa fa-upload pr5"></span>Deploy</button>
      </div>
    </div>
    <div class="panel-menu">
      <div class="btn-group">
        <div class="select-with-button" style="width: 179px">
          <select class="test-link-endpoints-select select2-single form-control">
            <% _.each(urlEndpointsJSON, function(endpoint){ %>
              <option value="">
                <%= endpoint.name %>
              </option>
              <% }) %>
          </select>
        </div>
        <button type="button" style="border-left:none; height: 39px" class="open-test-link pl10 pt5 pb5 btn btn-default btn-gradient dark">
          <span class="text-info fa fa-link pr5"></span>Open
        </button>
      </div>
    </div>
    <div class="admin-form panel-body pn pb25" style="font-size: 13px">
      <div class="name-and-optimizations-region">
      </div>
      <h5 class="title-divider text-muted mt30 mb0">
              Javascript Snippets 
              <a style="float: right" href="#">
                <i style="font-size: 18px !important" class="fa fa-question-circle text-info fs12 pl5 pr5"></i>
              </a>
              <a class="add-snippet-button" style="float: right" title="Add a new snippet" href="#">
                <i style="font-size: 18px !important" class="fa fa-plus text-info fs12 pl5 pr5"></i>
              </a>

            </h5>
      <div id="jssnippets-tree-container" class="snippets-container fancytree-radio">
        <div id="jssnippets-tree" class="fancytree-radio ui-fancytree-source">
        </div>
      </div>
    </div>
    <div class="panel-footer">
      <button type="button" class="delete-lander-button btn btn-danger btn-gradient dark"><span class="fa fa-trash pr5"></span>Delete Lander</button>
    </div>
  </div>
