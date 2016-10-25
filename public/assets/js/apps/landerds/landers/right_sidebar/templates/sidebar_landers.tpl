<!-- Start: Sidebar Right Content -->
<div class="sidebar-right-content nano-content p10">
  <div class="panel">
    <div class="panel-heading">
      <span class="panel-title">Lander Edit &amp; Optimization</span>
      <span class="close-right-sidebar panel-controls"><a href="#" class="panel-control-loader"></a><a href="#" class="panel-control-remove"></a></span>
    </div>
    <div class="panel-menu menu-buttons-region">
    </div>
    <div class="lander-modified-region"></div>
    <div class="panel-menu">
      <div class="url-endpoints-region"></div>
      <div class="pagespeed-region"></div>
      <h5 class="title-divider mt20 mb0">
              Active Snippets
              
              <a class="add-snippet-button" style="float: right" title="Add a new snippet" href="#">
                <i style="font-size: 18px !important" class="fa fa-plus text-info fs12 pl5 pr5"></i>
              </a>

            </h5>
      <div id="jssnippets-tree-container" class="snippets-container fancytree-radio" style="margin-bottom: 20px;">
        <div id="jssnippets-tree" class="fancytree-radio ui-fancytree-source">
        </div>
      </div>
    </div>
    <div class="admin-form panel-body pn pb25" style="border-top: none; font-size: 13px">
      <div class="deployment-options-region"></div>
      <h5 class="title-divider mt20 mb0">
        Download
      </h5>
      <table class="optimizations-table table">
        <tr>
          <td>
            <a class="download-original-lander" href="/api/landers/download?version=original&id=<%= id %>">Original Lander <span style="float: right" class="mr5 mt5 fa fa-download"></span></a>
          </td>
        </tr>
        <tr>
          <td>
            <a class="download-optimized-lander" href="/api/landers/download?version=optimized&id=<%= id %>">Optimized Lander <span style="float: right" class="mt5 mr5 fa fa-download"></span></a></a>
          </td>
        </tr>
      </table>
    </div>
    <div>
      <table class="table">
        <tbody>
          <tr class="dark">
            <td>
              <a href="#"><span class="ml5">Report This Lander Broken <i style="float: right" class="mr10 mt5 text-danger fa fa-warning"></i></span></a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="panel-footer">
      <button type="button" class="delete-lander-button btn btn-danger btn-gradient dark"><span class="fa fa-trash pr5"></span>Delete Lander</button>
    </div>
  </div>
