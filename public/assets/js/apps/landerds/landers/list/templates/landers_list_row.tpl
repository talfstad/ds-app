<div class="panel-group">
  <div class="panel">
    <div class="panel-heading">
      <div class="list-row-item accordion-toggle accordion-icon link-unstyled" data-toggle="collapse" data-parent="#list-collection" href="#accord<%= id %>">

        <% if(modified) { %>
        <span style="position: relative; bottom: 1px;" class="pl5">
          <i class="fa fa-circle text-warning fs12 pr5"></i>
        </span>
        <% } %>

        <input readonly class="editable-lander-name fw500" type="text" value="<%= name %>">
        <span class="measure-width" style="display:none;"><%= name %></span>

        <div class="alert-deleting-badge widget-menu domain-group-notification" style="display: none; right: 140px; min-width: 100px">
          <div class="row-deploy-status btn-group">
            <button type="button" style="border: none;" class="row-deploy-status-button pt5 pb5 pl10 pr10 btn text-danger btn-default light">
              <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate">
                </span>
              <span style="padding-left: 5px">Deleting</span>
            </button>
          </div>
        </div>
        <div class="widget-menu domain-group-notification">
          <span class="fs11" title="created on <%= created_on_gui %>"><%= created_on_gui %></span>
        </div>
      </div>
      <div class="alert-working-badge widget-menu domain-group-notification" style="display: none; right: 140px; min-width: 100px">
        <div class="row-deploy-status btn-group">
          <button type="button" style="border: none;" class="row-deploy-status-button pt5 pb5 pl10 pr10 btn text-alert btn-default light">
            <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate">
                </span>
            <span class="deploy-status-gui" style="padding-left: 5px"><%= deploy_status_gui %></span>
          </button>
        </div>
      </div>
      <ul class="nav panel-tabs">
        <li class="notes-tab-handle-region" data-tab-target="notes-tab-id-<%= id %>">
          <a href="#notes-tab-id-<%= id %>" data-toggle="tab" class="notes-status-tab-handle">
            <span class="open_sidemenu_r">
                <span style="position: relative; top: 2px;" class="fs18 fa fa-sticky-note"></span>
            <span style="font-size: 12px; line-height: 29px; margin-left: 4px;">Notes </span>
            </span>
          </a>
        </li>
        <li class="group-tab-handle-region" data-tab-target="groups-tab-id-<%= id %>"></li>
        <li class="deploy-status-region" data-tab-target="domains-tab-id-<%= id %>"></li>
      </ul>
    </div>
    <div id="accord<%= id %>" class="panel-collapse collapse" style="height: auto;">
      <div class="tab-content">
        <div class="tab-pane " role="tabpanel" id="domains-tab-id-<%= id %>">
          <div class="panel-menu clearfix">
            <div class="row" style="margin-left: 0px; margin-right: 0px;">
              <div style="display: block" class="clearfix deployed-landers-header-container">
                <span style="width: 20px">#</span>
                <span class="table-name-header" style="margin-left: 15px">Deployed Domain</span>
                <span class="deployed-landers-header deployed-domain-links-header">Domain Link</span>
                <span class="deployed-landers-header " style="margin-left: 315px">YSlow Load Time</span>
              </div>
              <div style="float: right;" class="deploy-to-new-domain-region clearfix">
              </div>
            </div>
          </div>
          <div class="panel-body">
            <div style="padding-bottom: 15px">
              <table class="table deployed-domains-region"></table>
            </div>
          </div>
        </div>
        <div class="tab-pane" role="tabpanel" id="groups-tab-id-<%= id %>">
          <div class="panel-menu clearfix">
            <div class="row" style="margin-left: 0px; margin-right: 0px;">
              <div style="margin-left: 5px; font-weight: 600; padding-top: 10px; float: left;" class="clearfix">
                <span style="width: 20px">#</span>
                <span style="margin-left: 15px">Group</span>
              </div>
              <div style="float: right;" class="add-to-new-group-region clearfix">
              </div>
            </div>
          </div>
          <div class="panel-body">
            <div style="padding-bottom: 15px">
              <table class="table active-groups-region"></table>
            </div>
          </div>
        </div>
        <div class="tab-pane" role="tabpanel" id="notes-tab-id-<%= id %>">
          <div class="panel-body pn of-h" style="border-top: none;">
            <div class="summernote"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
