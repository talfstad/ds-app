<!-- Start: Sidebar Right Content -->
<div class="sidebar-right-content nano-content p10">
  <div class="panel">
    <div class="panel-heading">
      <span class="panel-title">Lander Edit &amp; Optimization</span>
      <span class="close-right-sidebar panel-controls"><a href="#" class="panel-control-loader"></a><a href="#" class="panel-control-remove"></a></span>
    </div>
    <div class="panel-menu menu-buttons-region" style="background-color: white">
    </div>
    
    <div class="lander-modified-region"></div>

    <div class="panel-menu">
      <div class="btn-group">
        <div class="select-with-button" style="width: 163px">
          <select class="preview-link-endpoints-select select2-single form-control">
            <% _.each(urlEndpointsJSON, function(endpoint){ %>
              <option value="">
                <%= endpoint.filename %>
              </option>
              <% }) %>
          </select>
        </div>
        <button type="button" style="width: 90px; border-left:none; height: 39px; border-radius: 0 4px 4px 0" class="open-preview-link pl10 pt5 pb5 btn btn-default btn-gradient dark">
          <span style="font-size: 14px" class="text-info fa fa-eye pr5"></span>Preview
        </button>
      </div>

           <h5 class="title-divider mt10 mb0">
              Google PageSpeed 
             <!--  <a class="snippet-help-button tool-tip" title="Javascript Snippets feature isn't quite ready yet!" style="float: right" href="#">
                <i style="font-size: 18px !important" class="fa fa-question-circle text-info fs12 pl5 pr5"></i>
              </a> -->

            </h5>
      <div style="width: 250px; height: 100px; margin: 0 auto">
        <div id="original-lander-pagespeed" style="width: 125px; height: 100px; float: left"></div>
        <div id="optimized-lander-pagespeed" style="width: 125px; height: 100px; float: left"></div>
      </div>


    </div>

    
    <div class="admin-form panel-body pn pb25" style="border-top: none; font-size: 13px">
      
      <h5 class="title-divider mt20 mb0">
              Active Javascript Snippets 
              
              <a class="add-snippet-button" style="float: right" title="Add a new snippet" href="#">
                <i style="font-size: 18px !important" class="fa fa-plus text-info fs12 pl5 pr5"></i>
              </a>

            </h5>
      <div id="jssnippets-tree-container" class="snippets-container fancytree-radio" style="margin-bottom: 80px;">
        <div id="jssnippets-tree" class="fancytree-radio ui-fancytree-source">
        </div>
      </div>
      <div class="name-and-optimizations-region">
      </div>
      <h5 class="title-divider mt20 mb0">
        Download
      </h5>
      <table class="optimizations-table table">
  <tr>
    <td>
      Original Lander
    </td>
    <td align="right" style="width: 30px;">
        <a href="#"><span class="fa fa-download"></span></a>
    </td>
  </tr>
  <tr>
    <td>
      Optimized Lander
    </td>
    <td align="right" style="width: 30px;">
        <a href="#"><span class="fa fa-download"></span></a>
    </td>
  </tr>
</table>

    </div>
    
    <div class="panel-footer">
      <button type="button" class="delete-lander-button btn btn-danger btn-gradient dark"><span class="fa fa-trash pr5"></span>Delete Lander</button>
    </div>
  </div>
