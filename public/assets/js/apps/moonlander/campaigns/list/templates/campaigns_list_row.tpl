<div class="panel-group">
  <div class="panel">
    <div class="panel-heading">
      <a class="accordion-toggle accordion-icon link-unstyled" data-toggle="collapse" data-parent="#campaigns-collection" href="#accord<%= id %>">
        <%= name %>

          <div class="alert-working-badge widget-menu domain-lander-notification" style="display: none; right: 140px; top: 5px; min-width: 100px">
            <span class="open_sidemenu_r label">
        
          <div class="text-alert">
            <span style="position: relative; top: 2px" class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>  
           <span>Working...</span>
           </div>
            </span>
          </div>

          <div class="widget-menu domain-lander-notification">
            <span class="fs11"><%= created_on_gui %></span>
          </div>
      </a>
      <ul class="nav panel-tabs">
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
                <span style="margin-left: 15px">Deployed Domains</span>
              </div>
              <div style="float: right;" class="add-to-new-campaign-region clearfix">
              </div>
            </div>
          </div>
          <div class="panel-body">
            <div style="padding-bottom: 15px">
              <table class="table deployed-domains-region"></table>
            </div>
          </div>
        </div>
        <div class="tab-pane " role="tabpanel" id="landers-tab-id-<%= id %>">
          <div class="panel-menu clearfix">
            <div class="row" style="margin-left: 0px; margin-right: 0px;">
              <div class="clearfix deployed-landers-header-container">
                <span style="width: 20px">#</span>
                <span style="margin-left: 15px">Lander Name</span>
                <span class="deployed-landers-header">Lander Links</span>
              </div>
              <div style="float: right;" class="deploy-to-new-campaign-region clearfix">
              </div>
            </div>
          </div>
          <div class="panel-body">
            <div style="padding-bottom: 15px">
              <table class="table deployed-landers-region"></table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
