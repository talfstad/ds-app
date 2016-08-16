
  <div class="panel-group">
    <div class="panel">
      <div class="panel-heading">
        <a class="accordion-toggle accordion-icon link-unstyled" data-toggle="collapse" data-parent="#landers-collection" href="#accord<%= id %>">
          <%= name %>

          <div class="alert-working-badge widget-menu domain-campaign-notification" style="display: none; right: 140px; top: 5px; min-width: 100px">
            <span class="open_sidemenu_r label">
        
          <div class="text-alert">
            <span style="position: relative; top: 2px" class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>  
           <span style="padding-left: 5px">Working</span>
           </div>
            </span>
          </div>
          <!-- <div class="alert-modified-badge widget-menu domain-campaign-notification" style="display: none; right: 140px; top: 5px; min-width: 100px">
            <span class="open_sidemenu_r label">
        
          <div class="text-warning">
           <span>Outdated</span>
           </div>
            </span>
          </div> -->
          <div class="alert-deleting-badge widget-menu domain-campaign-notification" style="display: none; right: 140px; top: 5px; min-width: 100px">
            <span class="open_sidemenu_r label">
        
          <div class="text-danger">
            <span style="position: relative; top: 2px" class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>  
            <span>Deleting</span>
           </div>
            </span>
          </div>
       
        <div class="widget-menu domain-campaign-notification">
           <span class="fs11" title="created on <%= created_on_gui %>"><%= created_on_gui %></span>
        </div>
         </a>
       
        <ul class="nav panel-tabs">
          <li class="campaign-tab-handle-region" data-tab-target="campaigns-tab-id-<%= id %>"></li>
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
                  <span class="table-name-header" style="margin-left: 15px">Deployed Domains</span>
                  <span class="deployed-landers-header deployed-domain-links-header">Domain Links</span>
                  <span class="deployed-landers-header " style="margin-left: 315px">Load Time</span>
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

          <div class="tab-pane" role="tabpanel" id="campaigns-tab-id-<%= id %>">
            <div class="panel-menu clearfix">
              <div class="row" style="margin-left: 0px; margin-right: 0px;">
                <div style="margin-left: 5px; font-weight: 600; padding-top: 10px; float: left;" class="clearfix">
                <span style="width: 20px">#</span>
                <span style="margin-left: 15px">Campaigns</span>
                <span style="margin-left: 25px">Domains on Campaign</span>
              </div>
                <div style="float: right;" class="add-to-new-campaign-region clearfix">
                  
                </div>
              </div>
             </div>
            <div class="panel-body">
              <div style="padding-bottom: 15px">
                <table class="table active-campaigns-region"></table>
              </div>
            </div>
          </div>



        </div>
      </div>
    </div>
  </div>
