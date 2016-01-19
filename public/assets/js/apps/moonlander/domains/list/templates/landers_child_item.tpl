
  <div class="panel-group">
    <div class="panel">
      <div class="panel-heading">
        <a class="accordion-toggle accordion-icon link-unstyled" data-toggle="collapse" data-parent="#landers-collection" href="#accord<%= id %>">
          <%= name %>
       
        <div class="widget-menu domain-campaign-notification">
           <span class="fs11 text-muted" title="Currently deployed on 2 domains"><%= last_updated_gui %></span>
        </div>
         </a>
       
        <ul class="nav panel-tabs">
          <li class="campaign-tab-handle-region" data-tab-target="campaigns-tab-id-<%= id %>"></li>
          <li class="lander-tab-handle-region" data-tab-target="domains-tab-id-<%= id %>"></li>
        </ul>
      </div>
      <div id="accord<%= id %>" class="panel-collapse collapse" style="height: auto;">
        <div class="tab-content">
          <div class="tab-pane " role="tabpanel" id="domains-tab-id-<%= id %>">
            <div class="panel-menu clearfix">
              <div class="row" style="margin-left: 0px; margin-right: 0px;">
                <div style="margin-left: 5px; padding-top: 10px; float: left;" class="clearfix">
                  <span style="width: 20px">#</span>
                  <span style="margin-left: 15px">Deployed Landers</span>
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
                <div style="margin-left: 5px; padding-top: 10px; float: left;" class="clearfix">
                  <span style="width: 20px">#</span>
                  <span style="margin-left: 15px">Current Campaigns</span>
                </div>
                <div style="float: right;" class="add-to-new-campaign-region clearfix">
                  
                </div>
              </div>
             </div>
            <div class="panel-body">
              <div style="padding-bottom: 15px">
                <table class="table active_campaigns_region"></table>
              </div>
            </div>
          </div>



        </div>
      </div>
    </div>
  </div>
