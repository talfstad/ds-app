<!--<h5 class="title-divider mt20 mb0"><span style="">Page Speed Optimizations</span>
              <a style="float: right" href="#">
                <i style="font-size: 18px !important" class="fa fa-question-circle text-info fs12 pl5 pr5"></i>
              </a>
            </h5>
 <table class="optimizations-table table">
  <tr>
    <td>Fully Optimize Lander</td>
    <td>
      <label class="pull-right switch switch-success switch-round block mn">
        <% if(optimized) { %>
          <input type="checkbox" checked name="optimized" id="optimized" value="angular">
          <% } else { %>
            <input type="checkbox" name="optimized" id="optimized" value="angular">
            <% } %>
              <label for="optimized" data-on="YES" data-off="NO"></label>
      </label>
    </td>
  </tr>
</table> -->


<h5 class="title-divider mt20 mb0"><span style="">Page Speed Scores</span>
                <i title="Lander must be deployed to show optimized page speed" style="font-size: 18px !important; float: right;" class="fa fa-warning tool-tip text-warning fs12 pl5 pr5"></i>
              </h5>
<table class="optimizations-table table">
  <tr>
    <td>
      <a href="#">
      <i style="font-size: 18px !important; position: relative; top: 2px" class="fa fa-file-code-o text-default fs12 pr5"></i></a>
    <span style="cursor: pointer">index.html</span></td>
    <td align="right" style="width: 30px;">
        <span class="badge bg-default">32/100</span>
    </td>
  </tr>
  <tr>
    <td>
      <a href="#">
      <i style="font-size: 18px !important; position: relative; top: 2px" class="fa fa-file-code-o text-default fs12 pr5"></i></a>
    <span style="cursor: pointer">safe.html</span></td>
    <td align="right" style="width: 30px;">
        <span class="badge bg-default">32/100</span>
    </td>
  </tr>
</table>
<h5 class="title-divider mt20 mb10"><span style="">Deployment Folder Name</span>
              <a style="float: right" href="#">
                <i style="font-size: 18px !important" class="fa fa-question-circle text-info fs12 pl5 pr5"></i>
              </a>
            </h5>
<div class="clearfix">
  <input id="deploy-folder-edit" name="deployment_folder_name" style="width: 100%; float: left;" class="form-control" type="text" value="<%= deployment_folder_name %>">
</div>

<table class="optimizations-table table">
  <tr>
    <td>Deploy to Domain Root</td>
    <td>
      <label class="pull-right switch switch-success switch-round block mn">
        <% if(deploy_root) { %>
          <input type="checkbox" checked name="deploy_root" id="deploy-root" value="angular">
          <% } else { %>
            <input type="checkbox" name="deploy_root" id="deploy-root" value="angular">
            <% } %>
              <label for="deploy-root" data-on="YES" data-off="NO"></label>
      </label>
    </td>
  </tr>
</table>
