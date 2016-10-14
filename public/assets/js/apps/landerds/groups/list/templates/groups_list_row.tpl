<div class="panel-group">
  <div class="panel">
    <div class="panel-heading">
      <div class="list-row-item accordion-toggle accordion-icon link-unstyled" data-toggle="collapse" data-parent="#list-collection" href="#accord<%= id %>">
        <input readonly class="editable-lander-name fw500" type="text" value="<%= name %>">
        <span class="measure-width" style="display:none;"><%= name %></span>
        <div class="alert-working-badge widget-menu domain-lander-notification" style="display: none; right: 140px; top: 5px; min-width: 100px">
          <span class="open_sidemenu_r label">
              <div class="text-alert">
                <span style="position: relative; top: 2px" class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> <span style="padding-left: 2px" class="deploy-status-text">Working</span>
        </div>
        </span>
      </div>
      <div class="widget-menu domain-lander-notification">
        <span class="fs11"><%= created_on_gui %></span>
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
      <li class="domain-tab-handle-region" data-tab-target="domains-tab-id-<%= id %>"></li>
      <li class="lander-tab-handle-region" data-tab-target="landers-tab-id-<%= id %>"></li>
    </ul>
  </div>
  <div id="accord<%= id %>" class="panel-collapse collapse" style="height: auto;">
    <div class="tab-content">
      <div class="tab-pane" role="tabpanel" id="domains-tab-id-<%= id %>">
        <div class="panel-menu clearfix">
          <div class="row" style="margin-left: 0px; margin-right: 0px;">
            <div style="margin-left: 5px; font-weight: 600; padding-top: 10px; float: left;" class="clearfix">
              <span style="width: 20px">#</span>
              <span style="margin-left: 15px">Domain Name</span>
            </div>
            <div style="float: right;" class="add-to-new-group-region clearfix">
            </div>
          </div>
        </div>
        <div class="panel-body">
          <div style="padding-bottom: 15px">
            <table class="table domains-region"></table>
          </div>
        </div>
      </div>
      <div class="tab-pane " role="tabpanel" id="landers-tab-id-<%= id %>">
        <div class="panel-menu clearfix">
          <div class="row" style="margin-left: 0px; margin-right: 0px;">
            <div class="clearfix deployed-landers-header-container">
              <span style="width: 20px">#</span>
              <span style="margin-left: 15px">Lander Name</span>
            </div>
            <div style="float: right;" class="deploy-to-new-group-region clearfix">
            </div>
          </div>
        </div>
        <div class="panel-body">
          <div style="padding-bottom: 15px">
            <table class="table deployed-landers-region"></table>
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
